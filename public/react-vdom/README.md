# React · JSX

Uruchom serwer w tym katalogu:

```powershell
node server.cjs
```

Otwórz http://127.0.0.1:4181/. Biblioteki są pobierane z CDN, więc potrzebne jest połączenie z internetem. Opcjonalnie ustaw zmienną środowiskową `PORT`, aby wybrać inny port.

Kod w edytorze powinien deklarować komponent `App` i korzystać z globalnego `React`. Laboratorium uruchamia kod w izolowanym iframe; jest przeznaczone do zaufanego kodu szkoleniowego. Nieskończona pętla może zawiesić przeglądarkę.

Drzewo powstaje na podstawie danych React Fiber z React 18. Diff porównuje migawki wyświetlanego drzewa, a nie operacje DOM. Instrumentacja dodaje przełączniki tylko dla obsługiwanych konstrukcji; przykłady z callbackiem inline i blokiem funkcji `map` pokazują przypadki bez odpowiedniego przełącznika. Typy JSX dołączone do Monaco obejmują ograniczony zakres, a Babel usuwa typy bez sprawdzania ich poprawności.
