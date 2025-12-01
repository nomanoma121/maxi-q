```mermaid
erDiagram

users {
        TEXT id PK "ユーザーID "
        TEXT display_id UK "表示ID(重複不可)"
        TEXT name "ユーザー名"
        TEXT email UK "メールアドレス（重複不可）"
        TEXT password_hash "ハッシュ化パスワード"
        TEXT created_at "作成日時"
    }

questions {
    TEXT id PK "質問ID"
    TEXT author_id FK "投稿者のユーザーID(FK -> users.user_id)"
    TEXT content "内容"
    TEXT created_at "投稿日時"
    TEXT updated_at "更新日時"
    INTEGER solved "解決or未解決(default:0)"
    TEXT best_answer_id FK "ベストアンサーの回答ID(FK -> answers.answer_id, NULLable)"
}

answers {
    TEXT answer_id PK "回答ID"
    TEXT post_id FK "回答対象の質問ID(FK -> questions.que_id)"
    TEXT respondent_id FK "回答者のユーザーID(FK -> users.user_id)"
    TEXT content "内容"
    TEXT answered_at "回答日時"
    TEXT updated_at "更新日時"
}

users ||--o{ questions : "asks"
users ||--o{ answers : "answers"
questions ||--o{ answers : "has"
```