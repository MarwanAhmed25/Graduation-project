## admin model 

super admin 
-admin_email "marwan@gmail.com"
-admin_password: "marwan"

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