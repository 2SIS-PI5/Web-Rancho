# Backend Rancho Comanche

API REST em Java 17 com Spring Boot, Spring Security, JWT, JPA e banco configuravel por ambiente.

## Executar localmente

Requisitos: Java 17 e Maven 3.9+.

```powershell
cd backend
mvn spring-boot:run
```

Sem variaveis de ambiente, o backend usa um banco H2 local em `backend/data/rancho`. Para MySQL, configure:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/rancho_comanche?useSSL=true&serverTimezone=America/Sao_Paulo"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "senha-do-ambiente"
$env:DB_DRIVER = "com.mysql.cj.jdbc.Driver"
$env:JPA_DDL_AUTO = "validate"
$env:JWT_SECRET = "uma-chave-com-32-caracteres-ou-mais"
mvn spring-boot:run
```

## Endpoints

- `POST /api/auth/cadastro` e `POST /api/auth/login`
- `GET|PUT|DELETE /api/usuarios` (senha nunca e retornada; exclusao e logica)
- `GET|POST|PUT|DELETE /api/funcionarios`
- `GET|POST|PUT|PATCH|DELETE /api/escalas`
- `GET /api/dashboard/resumo`

Os endpoints, exceto autenticacao, exigem `Authorization: Bearer <token>`. O frontend Vite usa `VITE_API_URL` ou `http://localhost:8080/api`.