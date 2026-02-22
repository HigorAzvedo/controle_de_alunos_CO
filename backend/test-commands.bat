@echo off
echo ====================================
echo TESTES DOS ENDPOINTS - API ALUNOS
echo ====================================
echo.

echo [1] Verificando se API esta rodando...
curl -X GET http://localhost:3000/
echo.
echo.

echo [2] Listando classes disponiveis...
curl -X GET http://localhost:3000/api/classes
echo.
echo.

echo [3] Cadastrando aluno - Maria Silva (3 anos - classe Moises)...
curl -X POST http://localhost:3000/api/alunos -H "Content-Type: application/json" -d "{\"nome\":\"Maria Silva\",\"data_nascimento\":\"2023-05-15\"}"
echo.
echo.

echo [4] Cadastrando aluno - Joao Pedro (15 anos - classe Daniel)...
curl -X POST http://localhost:3000/api/alunos -H "Content-Type: application/json" -d "{\"nome\":\"Joao Pedro\",\"data_nascimento\":\"2010-08-20\"}"
echo.
echo.

echo [5] Cadastrando aluno - Ana Carolina (25 anos - classe Embaixadores)...
curl -X POST http://localhost:3000/api/alunos -H "Content-Type: application/json" -d "{\"nome\":\"Ana Carolina\",\"data_nascimento\":\"2000-03-10\"}"
echo.
echo.

echo [6] Cadastrando aluno - Carlos Eduardo (40 anos - classe Arautos)...
curl -X POST http://localhost:3000/api/alunos -H "Content-Type: application/json" -d "{\"nome\":\"Carlos Eduardo\",\"data_nascimento\":\"1985-12-01\"}"
echo.
echo.

echo [7] Listando todos os alunos cadastrados...
curl -X GET http://localhost:3000/api/alunos
echo.
echo.

echo [8] Revalidando classes de todos os alunos...
curl -X PUT http://localhost:3000/api/alunos/revalidar-classes
echo.
echo.

echo ====================================
echo TESTES CONCLUIDOS!
echo ====================================
pause
