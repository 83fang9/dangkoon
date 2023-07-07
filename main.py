from fastapi import FastAPI,UploadFile,Form,Response,Depends
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from typing import Annotated
import sqlite3

con = sqlite3.connect('db.db', check_same_thread=False) #DB접속
cur = con.cursor() #db에 커서라는 기능이 있어서 그걸 사용할꺼다

cur.execute(f"""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            image BLOB,
            price INTEGER NOT NULL,
            description TEXT,
            place TEXT NOT NULL,
            insertAt INTEGER NOT NULL
        );
            """)

app = FastAPI()

#로그인 할떄 암호 디코딩함
SERCRET = 'super-coding'
manager = LoginManager(SERCRET, '/login') 


@manager.user_loader()
def query_user(data):
    WHERE_STATEMENTS = f'id="{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'name="{data["name"]}"'

    con.row_factory = sqlite3.Row 
    cur = con.cursor()
    user = cur.execute(f"""
                       SELECT * from users WHERE {WHERE_STATEMENTS}
                       """).fetchone()
    return user

@app.post('/login')
def login(id:Annotated[str,Form()], 
           password:Annotated[str,Form()]):
    #id로 유저를 찾아와라
    user = query_user(id)
    # print(user)
    if not user:
        raise InvalidCredentialsException
    elif password != user['password']:
        raise InvalidCredentialsException  #401서버 에러 표시해쥼 (비번틀리면)
    
    access_token = manager.create_access_token(data={
        'sub': {
        'id': user['id'],
        'name': user['name'],
        'email': user['email']
        }
    })
    
    return {'access_token':access_token}


@app.post('/signup')
def signup(id:Annotated[str,Form()], 
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str,Form()]):
    
    #서버저장 명령문
    cur.execute(f"""
                INSERT INTO users (id,name,email,password)
                VALUES ('{id}','{name}','{email}','{password}')
                """)
    con.commit()
    return '200'


#서버에 올릴때 클래스화 시켜 올려야 한다. 
class Chatting(BaseModel):
    id: str
    content: str

#올려진 내용은 배열로 올라간다.    
chats =[]

@app.post("/chats")
def create_chat(chat:Chatting):
    chats.append(chat)
    return '메세지 저장에 성공했습니다'

@app.get("/chats")
def read_chat():
    return chats
    


@app.post('/items')
async def create_item(image:UploadFile,
                title:Annotated[str,Form()], #폼데이터 형식으로 문자로 보낸다
                price:Annotated[int,Form()],
                description:Annotated[str,Form()],
                place:Annotated[str,Form()],
                insertAt:Annotated[int,Form()],
                ):
    
    # print(image,title,price,description,place)
    image_bytes = await image.read() #이미지를 읽을 시간을 준다
    cur.execute(f"""    
                INSERT INTO items(title, image, price, description, place, insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """) 
    con.commit()
    return '200'

@app.get('/items')
async def get_items(user=Depends(manager)):  #유저인증된 사람만 됨
    con.row_factory = sqlite3.Row    #컬럼명 가져오는 문구
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * from items;     
                       """).fetchall()    #모두 가져와라 -> 이건 내용만 다 가져오는거라 컬럼명 안가져옴
    return JSONResponse(jsonable_encoder(dict(row) for row in rows)) #디셔너리화 시켜서 가져오는 문구
        #가져온 자료는 JSON형식이 아니므로 인코더를 실행해준다.

# 서버로 get한 rows = [['id,1],['title',삭킬]....] 이런 어레이 형식임
 # 이때 dict(row) for row in rows 를 실행하면
  # {id:1, title:'식칼'....} 이런식으로 디셔너리 즉 객체형태로 바꿔주어 프론트에서 자료를 쉽게 다룰수 있게 해준다 

@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    #16진법
    image_bytes = cur.execute(f"""  
                             SELECT image from items WHERE id={item_id}
                             """).fetchone()[0]  #하나만 가져올떄 사용. 밖에있는 껍데기 하나를 벗겨주는 용도 

    return Response(content=bytes.fromhex(image_bytes), media_type='image/*') #16진법을 가져와 이걸 사용가능하게 변환

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
