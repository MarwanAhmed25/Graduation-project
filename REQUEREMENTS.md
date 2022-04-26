# Project Models Routes
- Base URL : https://app4125.herokuapp.com/
- super admin 
    - admin_email: "marwan@gmail.com"
    - admin_password: "marwan"

## Admin model 

```
index: GET /admins

    body: []
    headers: admin_email, admin_password

show: GET /admins/:id

    body: []
    headers: admin_email, admin_password


create: POST /admins

    body: [
        f_name: string
        l_name: string
        email: string   //required
        password:string //required
        birthday: string
        phone: string
        address: strin
        salary: string
    ]
    headers: admin_email, admin_password

update: PATCH /admins/:id

    body: [
        f_name: string
        l_name: string
        email: string
        birthday: string
        phone: string
        address: strin
        status: string
    ]
    headers: admin_email, admin_password

delete: DELETE /admins/:id

    body: []
    headers: admin_email, admin_password

login: GET /admins/auth/login

    body: []
    headers: admin_email, admin_password


//pending
forget_password: GET /admins/auth/forget_password

reset_password: POST /admins/auth/reset_password

```


## User model 
```
index: GET /users

    body: []
    headers: []

show: GET /users/:id

    body: []
    headers: []


create: POST /users

    body: [
        f_name: string
        l_name: string
        email: string   //required
        password:string //required
        birthday: string
        phone: string
        city: string
        address: strin
        type_id: number //FK for model types
        admin_id:number //FK for admin accepted user
        role: string ['volanteer', 'needy', organization', 'user']
        images: array<string>
        description: string
    ]

    headers: []

update: PATCH /users/:id

    body: [
        //if user itself
        f_name: string
        l_name: string
        email: string   
        password:string 
        birthday: string
        phone: string
        city: string
        address: strin
        rate: number 
        images: array<string>
        description: string

        //if admin
        status: string ['active', 'deactive', suspend']
        role: string ['volanteer', 'needy', organization', 'user']
    ]

    headers: token //for user or admin

delete: DELETE /users/:id

    body: []
    headers: token //for user 

login: GET /auth/login

    body: []
    headers: email, password  //for user


//pending
forget_password: GET /auth/forget_password

reset_password: POST /auth/reset_password

```



## Types model 
```
index: GET /types

    body: []
    headers: []

show: GET /types/:id

    body: []
    headers: []


create: POST /types

    body: [
        type: string //required
        image: string //required
        description: string //required
    ]

    headers: token //for admin

update: PATCH /types/:id

    body: [
        type: string
        image: string
        description: string
    ]

    headers: token //for admin

delete: DELETE /types/:id

    body: []
    headers: token //for admin 


```



## Links model 
```
index: GET /organization/:organization_id/links

    body: []
    headers: []

show: GET /organization/:organization_id/links/:id

    body: []
    headers: []


create: POST /organization/:organization_id/links

    body: [
        link: string //required
    ]

    headers: token //for organization

update: PATCH /organization/:organization_id/links/:id'

    body: [
        link: string
    ]

    headers: token //for organization

delete: DELETE /organization/:organization_id/links/:id

    body: []
    headers: token //for organization 


```


## Comments model 
```
index: GET /charity/:charity_id/comments

    body: []
    headers: []

show: GET /charity/:charity_id/comments/:id

    body: []
    headers: []


create: POST /charity/:charity_id/comments

    body: [
        message: string //required
    ]

    headers: token //for user

update: PATCH /charity/:charity_id/comments/:id

    body: [
        message: string
    ]

    headers: token //for user

delete: DELETE /charity/:charity_id/comments/:id

    body: []
    headers: token //for admin or user 


```



## Charity model 
```
index: GET /charity

    body: []
    headers: []

show: GET /charity/:id

    body: []
    headers: []


create: POST /charity

    body: [
        description: string //required
        images: array<string> //required
        status: string ['complete', 'pendding'] //required
        needy_id: number   //FK users //required
        volanteer_id: number //FK users //required
    ]

    headers: token //for admin

update: PATCH /charity/:id

    body: [
        description: string
        images: array<string>
        status: string ['complete', 'pendding']
        needy_id: number   //FK users
        volanteer_id: number //FK users
    ]

    headers: token //for admin

delete: DELETE /charity/:id

    body: []
    headers: token //for admin


```