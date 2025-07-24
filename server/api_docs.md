# Plan API Documentation

## Endpoints

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /google-login`

Routes below need authentication:

- `GET /plans`
- `POST /plans`
- `GET /plans/:id`
- `PUT /plans/:id`
- `DELETE /plans/:id`
- `PUT /plans/:id/feedback`
- `POST /plans/:id/generate-quizzes`

&nbsp;

## 1. POST /register

Description:

- Register a new user

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. POST /login

Description:

- Login user

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid email or password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

## 2a. POST /google-login

Description:

- Login/register user via Google OAuth

Request:

- body:

```json
{
  "google_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid Google token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 3. GET /plans

Description:

- Get all plans for authenticated user

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "userId": "number",
    "judulBelajar": "string",
    "aiFeedback": "string",
    "quizzes": [
      /* array of quiz object */
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 4. POST /plans

Description:

- Create a new plan

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "userId": "number",
  "judulBelajar": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "userId": "number",
  "judulBelajar": "string",
  "aiFeedback": "string",
  "quizzes": null,
  "createdAt": "string",
  "updatedAt": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 5. GET /plans/:id

Description:

- Get plan by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "id": "number",
  "userId": "number",
  "judulBelajar": "string",
  "aiFeedback": "string",
  "quizzes": [
    /* array of quiz object */
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Plan not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 6. PUT /plans/:id

Description:

- Update plan by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "judulBelajar": "string"
}
```

_Response (200 - OK)_

```json
{
  "id": "number",
  "userId": "number",
  "judulBelajar": "string",
  "aiFeedback": "string",
  "quizzes": [
    /* array of quiz object */
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Plan not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 7. DELETE /plans/:id

Description:

- Delete plan by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "message": "Plan deleted"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Plan not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 8. PUT /plans/:id/feedback

Description:

- Generate or update AI feedback for a plan

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "aiFeedback": "string"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Plan not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 9. POST /plans/:id/generate-quizzes

Description:

- Generate quizzes for a plan using Gemini AI

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "quizzes": [
    {
      "pertanyaan": "string",
      "correctAnswer": "string",
      "userAnswer": "string"
    }
  ]
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Plan not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

## 10. GET /plans/quotes

Description:

- Get a random inspirational quote (ZenQuotes)

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "q": "string", // quote text
  "a": "string" // author
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

---

## 11. GET /plans/activity

Description:

- Get a random activity (Bored API)

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "activity": "string"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

---

---

**Note:**

- Semua endpoint `/plans` dan turunannya butuh header:  
  `Authorization: Bearer <access_token>`
- Field `quizzes` di Plan adalah array of object, misal:
  ```json
  "quizzes": [
        {
            "pertanyaan": "Mengapa penting untuk belajar fokus pada masa kini?",
            "options": [
                "Agar tidak mengulang kesalahan masa lalu.",
                "Karena masa depan belum terjadi dan masa lalu sudah berlalu.",
                "Untuk merencanakan masa depan dengan lebih baik.",
                "Agar dapat melupakan semua masalah secara instan."
            ],
            "correctAnswer": "Karena masa depan belum terjadi dan masa lalu sudah berlalu."
        }
  ]
  ```
