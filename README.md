# Maxi-Q

匿名質問アプリ

## 開発方法

### フロントエンド

環境変数を設定するために`.env.example`をコピーして`.env`を作成してください。
`/packages/client/.env`が作成されていればOKです。

```bash
cd packages/client
npm install
npm run dev
```

### バックエンド

マイグレーションを適用するために以下を`./packages/server`で実行してください.

```bash
npm run db:migrate:local
```

また、マイグレーションを作成する場合は以下を実行してください。
```bash
npm run db:generate
```

```bash
cd packages/server
npm install
npm run dev
```
