# 2024-07-08,15点17d   算法最终的服务: nohup ~/miniconda3/bin/python  backend.py  &

import sqlite3
# import cv2
import os
import io
import json

from io import BytesIO  
import os
print(os.cpu_count(), 'cpushuliaing')

import  sqlite3

conn=sqlite3.connect('test.db',check_same_thread=False)
cursor=conn.cursor()
cursor.execute('create table if not exists user(id INTEGER PRIMARY KEY,name TEXT, data TEXT)')
conn.commit()




from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # 解决跨域问题

basedir = os.path.abspath(os.path.dirname(__file__))  # 定义一个根目录 用于保存图片用
UPLOAD_ROOT_PATH = 'pic_data'
# http://172.27.118.204:5050


from flask import Flask, request
lastorder={}
userdata=[]


@app.route('/food/record', methods=['GET', 'POST'])
def editorData222212112112333312312222():
    data=request.json
    print('32432423423423',data)
    ttt=data["uid"].replace('-','_')
    tt=f"SELECT * FROM user WHERE name = '{ttt}'"
    print(tt)
    cursor.execute(tt)
    res=cursor.fetchall()
    print(res,"rrrrrreeeeeeeeeeesssssssssss")
    if res:
        userdata=eval(res[0][2])
        print(userdata)
        print(type(userdata))
        flag='cunzai'
    else:
        flag='new'
        userdata=[]
    if data['uid'] :
        tmp=[]
        for i in userdata:
            if 'payed' in i:
                tmp.append(i)

        return jsonify(tmp)




@app.route('/userdata', methods=['GET', 'POST'])
def editorData222212112333312312222():
    a=request.json
    if a['id'] in lastorder:
        return jsonify(lastorder[a['id']])
    else:
        return jsonify({})

    return (lastorder)

import time,datetime

@app.route('/food/pay', methods=['GET', 'POST'])
def editorData22221211212312222():
    print(request.json,'拿到的数据')
    data=request.json
    
    #=============这段是读取数据的套路模板
    data=request.json
    print('32432423423423',data)
    ttt=data["uid"].replace('-','_')
    tt=f"SELECT * FROM user WHERE name = '{ttt}'"
    print(tt)
    cursor.execute(tt)
    res=cursor.fetchall()
    print(res,"rrrrrreeeeeeeeeeesssssssssss")
    if res:
        userdata=eval(res[0][2])
        print(userdata)
        print(type(userdata))
        flag='cunzai'
    else:
        flag='new'
        userdata=[]
    # =======套路模板结束
        
        
    userdata[int(data['id'])]['paytime']= time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
    if 'id' in data:
        userdata[int(data['id'])]['payed']=1
        #=======写入数据:
        userdatastr=str(userdata)
        cursor.execute("update  user  set  data=? where name =?",(userdatastr,ttt)) 
        conn.commit()
        
        
        return jsonify(userdata[int(data['id'])])
    # return jsonify(lastorder)


@app.route('/food/order', methods=['GET', 'POST'])
def editorData2222121222():
    # print("当前用户数据的数量",len(userdata))
    # print("当前用户数据",(userdata))
    print("查询",)
    data=request.json
    print('32432423423423',data)
    ttt=data["uid"].replace('-','_')
    tt=f"SELECT * FROM user WHERE name = '{ttt}'"
    print(tt)
    cursor.execute(tt)
    res=cursor.fetchall()
    print(res,"rrrrrreeeeeeeeeeesssssssssss")
    # print(res[0][2],"shujushi!!!!!!!!!!!")
    
    #==读取数据库:
    if res:
        userdata=eval(res[0][2])
        print(userdata)
        print(type(userdata))
        flag='cunzai'
    else:
        flag='new'
        userdata=[]
    print(99999999999999999999)
    global lastorder

    data=request.json
    print(data,8888888888)
    
    if 'comment' in data:
        userdata[int(data['id'])]['comment']=data['comment']
        print(' commmmmmmmmmmmmmmentt ',userdata)
        
        if flag!='':
            userdatastr=str(userdata)
            cursor.execute("update  user  set  data=? where name =?",(userdatastr,ttt)) 
            conn.commit()
        
        
        
    if 'id' in data:
        return jsonify(userdata[int(data['id'])])
        
    # print(data,99999999999999999999999)
    p=0
    # print(21321312312)
    # print(data,4355555555555555555555555555555)
    for i in data['order']:
        kk=data['order'][i]
        # print(65436346435342534534,kk)
        p+=float(kk['price'])*float(kk['number'])
    # 食物的图片使用网络图片url和本地路径都可以.
    # data=data['order']
    # print(999999999999998888888888,data)
    data['price']=p
    data['order_id']=len(userdata) #计算索引.

    userdata.append(data) # 写入数据库!!!!!!!!!!!!
    userdata=str(userdata)
    print('字符串化数据',userdata)
    if flag=='new':
        print(f"INSERT INTO user (name, data) VALUES ('{ttt}', '{userdata}')")
        cursor.execute("INSERT INTO user (name, data) VALUES (?,?)",(ttt,userdata)) 
        conn.commit()
    if flag!='':
        cursor.execute("update  user  set  data=? where name =?",(userdata,ttt)) 
        conn.commit()
    
    print(1111111,data)
    # print('sdaflkasdjflk;asdjflk',data)
    return jsonify(data)







@app.route('/food/list', methods=['GET', 'POST'])
def editorData222222():
    # 食物的图片使用网络图片url和本地路径都可以.
    return jsonify({'list':[{'name':'类别1','food':[{
        'id':0,
        'name':'食物1',
        'price':'11',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{
'id':1,
        'name':'食物2',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },
        {'id':2,
        'name':'食物3',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },
        {'id':3,
        'name':'食物4',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },
        {'id':4,
        'name':'食物5',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },
        {'id':5,
        'name':'食物6',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },
        {'id':6,
        'name':'食物7',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        }
        ]},{'name':'类别2','food':[{
            'id':7,
        'name':'食物21',
        'price':'11',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{
            'id':8,
        'name':'食物22',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{
            'id':81,
        'name':'食物221',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{
            'id':82,
        'name':'食物221',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{
            'id':8222,
        'name':'食物22',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        }
        ]},{'name':'类别3','food':[{
            'id':9,
        'name':'食物31',
        'price':'11',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{'id':10,
        'name':'食物32',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        }
        ]},{'name':'类别4','food':[{
            'id':11,
        'name':'食物41',
        'price':'11',
        'image_url':'/images/index/b_2.jpg',
        
        
        },{'id':12,
        'name':'食物42',
        'price':'12',
        'image_url':'/images/index/b_2.jpg',
        
        
        }
        ]}],
                    'promotion':['1','2','3']
                    
                    })


@app.route('/food/index', methods=['GET', 'POST'])
def editorData():
    
    return jsonify({'list':['1','2','3'],
                    'promotion':['1','2','3']
                    
                    })

@app.route('/user/setting', methods=['GET', 'POST'])
def editorData222():
    
    return jsonify({'isLogin':False})









if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80,debug=True)
