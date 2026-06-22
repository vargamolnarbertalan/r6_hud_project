### Push/join link
```txt
="https://vdo.ninja/?push=" & REGEXEXTRACT(P2, "push=([^&]+)") & "&quality=1&label=" & D2
```
### View link
```txt
="https://vdo.ninja/?view=" & REGEXEXTRACT(P2, "push=([^&]+)") & "&label=" & D2
```
To use in Google Sheets, where
- `P2` is the raw **push** link copied from vdo ninja.
- `D2` is the nickname of the player.