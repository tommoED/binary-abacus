create a static html page for a binary abacus web app 

The basic abacus:

- each row of the abacus features as set of 8 beads which the user can toggle by clicking
- the top header displays the binary place values (in decimal)
- each bead has an indicator of being 0 or 1
- at the end of each row is displayed the value of that row (in decimal)

extensions
flexibility:
- can change the number of beads to make bigger numbers
- change where the binary point is to allow fractions
- add options to include 2's complement, 1's complement, sign bit, endianness
- i will figure out some different configurations which make number
- adding a hexadecimal symbolic representation

usability:
- can 'swipe' across the beads with primary mouse button to set or unset
- can 'swipe' across the beads with secondary mouse button to toggle
- ?
- use keyboard input rows ["qwertyuui", "asdfghjk", "zxcvbnm,"] to set or toggle with shift modifier
- use arrow keys to 'shift' the mapped keys horizontally and vertically over the beads
    - left-right: corresponding to increase/decrease in 

robustness:

- remembers the state of the abacus on resizing
- refactor horrible GPT code to use a model-view-controller, and encode state in a struct that the view synchronises to rather than random globals

advanced:

- include ability to do multiplications with shifted representation.
- advanced encodings: IEEE floating points, ASCII


cosmetics:

<!-- - looks like actual beads which move up and down so that the user can smoothly transition to a physical abacus -->

learnability:

- game mechanics that instruct and teach number encoding and operations
- game where the student does calculations and is rewarded for precision and speed


