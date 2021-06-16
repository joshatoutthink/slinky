# Slinky The BattleSnake

## TODO:

### URGENT

- [x] Download Third Party App for Creating TestCases
- [x] Create Mock Data for Testing Search, Eat, and Avoid Walls
- [x] Create Tests for Search
- [x] Create Tests for Eat
- [x] Create Tests for Avoid Walls
- [x] Simplify Search Function

### LATER

- [ ] Secure Server
- [ ] Create Github Action for Deployment
- [ ] Clean up Code
- [ ] Implement Move Api / Decide on a Decision Tree Implementation
- [ ] Dont Die Function / Evaluate food should check if next move is possible
  - before you pick return spot check if nieghbors have free space

### TEST CASES TO ADD

- [ ] if nose is chasing tail move away from food
- [ ] if nose is chasing tail and:
  - [ ] if coiling clockwise and tail is on left -> try and go up : else down
  - [ ] if coiling counterclockwise and tail is on left -> try and go down else up
