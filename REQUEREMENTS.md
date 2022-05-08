# Project Models Routes
- Base URL : https://app4125.herokuapp.com/
- super admin 
    - admin_email: "marwan@gmail.com"
    - admin_password: "marwan"

## Admin model  

```
index: GET /admins

    body: []
    headers: email, password * super *

show: GET /admins/:id

    body: []
    headers: email, password * super *


create: POST /admins

    body: [
        full_name: string
        email: string   //required
        password:string //required
        birthday: string
        phone: string
        address: strin
        salary: float
    ]
    headers: email, password * super *

update: PATCH /admins/:id

    body: [
        full_name: string
        email: string
        birthday: string
        phone: string
        salary:float
        address: strin
        status: string
        password:string
    ]
    headers: email, password

delete: DELETE /admins/:id

    body: []
    headers: email, password * super *

login: GET /admins/auth/login

    body: []
    headers: email, password * super or any admin*


//pending
forget_password: GET /admins/auth/forget_password

reset_password: POST /admins/auth/reset_password

```


## User model 
```
index: GET /users

    body: []
    headers: [token] * admin *

show: GET /users/:id

    body: []
    headers: [token] * admin *


create: POST /users

    body: [
        full_name: string
        email: string   //required
        password:string //required
        profile_image:string
        birthday: string
        phone: string
        city: string
        address: string
        role: string ['volanteer', 'needy', organization', 'user']
        id_image: string
        
        //if organization
        link:string
    ]

    headers: []

update: PATCH /users/:id

    body: [
        //if user itself
        full_name: string
        email: string   //required
        password:string //required
        profile_image:string
        birthday: string
        phone: string
        city: string
        address: string
        id_image: string

        //if organization
        link:string

        //if admin
        status: string ['active', 'deactive', suspend']
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

logout

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

if there is a needy case in the type you can not delete it. 

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

////////////// ممكن يحصل تعديلات هنا بعد انشاء نظام الدفع ////////////////
create: POST /charity

    body: [
        description: string //required
        images: array<string> //required
        type_id: number, //required
        value_of_need: number, //required
    ]

    headers: token //for admin

update: PATCH /charity/:id

    body: [
        description: string
        images: array<string>
        type_id: number,

        //must be all exist or not all esixt
        amount: number // amount of pay form volanteer
        volanteer_id

    ]

    headers: token //for admin

delete: DELETE /charity/:id

    body: []
    headers: token //for admin


```




 
/// marwan 7/5/2022 ////////////////////////////////////////////////////////////////////////////////////////////
Models [ admins, users, types, charity_case, comments, links, volanteer_rate]
Index →show all rows in model.
Show →show one row in model.
Create →create new row.
Update →update row.
Delete →delete row.
Admins: crud operations
	Index: only super admin can use index.
	show: only super admin can use show.
	create: only super admin can use create.
	update: only super admin can use update.
	delete: only super admin can use delete.
users: crud operations
	Index: only admin can use index.
	show: only admin can use show.
	create: any new users  can use create.
	update: only the owner can use update and the admin can update the status only[suspend,active,deactive].
	delete: only the owner of profile can use delete.
charity_case: crud operations
	Index: all can use index.
	show: all can use show.
	create: only needy users or organization can use create.
	update: only the owner of the case can use update.
	delete: only the owner of the case can use delete.
types: crud operations [type of need mony, food, building…]
	Index: all can use index.
	show: all can use show.
	create: only admin can use create.
	update: only admin can use update.
	delete: only admin can use delete.
links: crud operations[ links for organization website]
	Index: all can use index.
	show: all can use show.
	create: created with organization creation.
	update: when organization updated.
	delete: will deleted whe delete the organization.
volanteer_rate: crud operations [rate of volanteer users]
	Index: all can use index.
	show: all can use show.
	create: created with volanteer creation.
	update: when volanteer help or pay mony for needy.
	delete: will deleted whe delete the volanteer.
comments: crud operations
	Index:all can use index.
	show: all can use show.
	create: only login users can use create.
	update: only owner user can use update.
	delete: only admin or owner user can use delete.
 
—----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 
  
Website workflow:
	Any new user can create new account as volanteer , user, organization,needy .
	We will send a sms and email message to verify email and phone and admin will verify his id_image after that he will be a verified profile in website.
 
Any User can create comment.
Needy or organization can create case.
Super admin can create,update,delete admins.
Admins can update status of any user.
Admins can delete any comment.
Admins can create, update ,delete types.
Organization and Volanteer can help or donates to needy cases.
 
   

// end of marwan /////////////////////////////////////////////////////////////////////////
