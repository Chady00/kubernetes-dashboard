# --- Imports and Setup ---
import numpy as np
import math
import random

ROWS = 6
COLUMNS = 7
PLAYER_PIECE = 1
AI_PIECE = 2
EMPTY = 0
WINDOW_LENGTH = 4

# --- Game Functions ---
def create_board():
    return np.zeros((ROWS, COLUMNS), dtype=int)

def drop_piece(board, row, col, piece):
    board[row][col] = piece

def is_valid_location(board, col):
    return board[ROWS - 1][col] == EMPTY

def get_next_open_row(board, col):
    for r in range(ROWS):
        if board[r][col] == EMPTY:
            return r

def print_board(board):
    print(np.flip(board, 0))

def winning_move(board, piece):
    for c in range(COLUMNS - 3):
        for r in range(ROWS):
            if all([board[r][c + i] == piece for i in range(WINDOW_LENGTH)]):
                return True
    for c in range(COLUMNS):
        for r in range(ROWS - 3):
            if all([board[r + i][c] == piece for i in range(WINDOW_LENGTH)]):
                return True
    for c in range(COLUMNS - 3):
        for r in range(ROWS - 3):
            if all([board[r + i][c + i] == piece for i in range(WINDOW_LENGTH)]):
                return True
    for c in range(COLUMNS - 3):
        for r in range(3, ROWS):
            if all([board[r - i][c + i] == piece for i in range(WINDOW_LENGTH)]):
                return True
    return False

def evaluate_window(window, piece):
    score = 0
    opp_piece = PLAYER_PIECE if piece == AI_PIECE else AI_PIECE
    if window.count(piece) == 4:
        score += 100
    elif window.count(piece) == 3 and window.count(EMPTY) == 1:
        score += 5
    elif window.count(piece) == 2 and window.count(EMPTY) == 2:
        score += 2
    if window.count(opp_piece) == 3 and window.count(EMPTY) == 1:
        score -= 4
    return score

def score_position(board, piece):
    score = 0
    center_array = [int(i) for i in list(board[:, COLUMNS // 2])]
    score += center_array.count(piece) * 3
    for r in range(ROWS):
        row_array = [int(i) for i in list(board[r, :])]
        for c in range(COLUMNS - 3):
            window = row_array[c:c + WINDOW_LENGTH]
            score += evaluate_window(window, piece)
    for c in range(COLUMNS):
        col_array = [int(i) for i in list(board[:, c])]
        for r in range(ROWS - 3):
            window = col_array[r:r + WINDOW_LENGTH]
            score += evaluate_window(window, piece)
    for r in range(ROWS - 3):
        for c in range(COLUMNS - 3):
            window = [board[r + i][c + i] for i in range(WINDOW_LENGTH)]
            score += evaluate_window(window, piece)
    for r in range(ROWS - 3):
        for c in range(COLUMNS - 3):
            window = [board[r + 3 - i][c + i] for i in range(WINDOW_LENGTH)]
            score += evaluate_window(window, piece)
    return score

def get_valid_locations(board):
    return [c for c in range(COLUMNS) if is_valid_location(board, c)]

def is_terminal_node(board):
    return winning_move(board, PLAYER_PIECE) or winning_move(board, AI_PIECE) or len(get_valid_locations(board)) == 0

def minimax(board, depth, alpha, beta, maximizingPlayer):
    valid_locations = get_valid_locations(board)
    is_terminal = is_terminal_node(board)
    if depth == 0 or is_terminal:
        if is_terminal:
            if winning_move(board, AI_PIECE):
                return (None, 100000000000000)
            elif winning_move(board, PLAYER_PIECE):
                return (None, -100000000000000)
            else:
                return (None, 0)
        else:
            return (None, score_position(board, AI_PIECE))
    if maximizingPlayer:
        value = -math.inf
        column = random.choice(valid_locations)
        for col in valid_locations:
            row = get_next_open_row(board, col)
            temp_board = board.copy()
            drop_piece(temp_board, row, col, AI_PIECE)
            new_score = minimax(temp_board, depth - 1, alpha, beta, False)[1]
            if new_score > value:
                value = new_score
                column = col
            alpha = max(alpha, value)
            if alpha >= beta:
                break
        return column, value
    else:
        value = math.inf
        column = random.choice(valid_locations)
        for col in valid_locations:
            row = get_next_open_row(board, col)
            temp_board = board.copy()
            drop_piece(temp_board, row, col, PLAYER_PIECE)
            new_score = minimax(temp_board, depth - 1, alpha, beta, True)[1]
            if new_score < value:
                value = new_score
                column = col
            beta = min(beta, value)
            if alpha >= beta:
                break
        return column, value

# --- Game Loop ---
def play_game():
    board = create_board()
    game_over = False
    turn = random.randint(PLAYER_PIECE, AI_PIECE)

    print("Welcome to Connect Four!")
    print_board(board)

    while not game_over:
        if turn == PLAYER_PIECE:
            while True:
                try:
                    col = int(input("Player 1, choose your column (0-6): "))
                    if col not in range(COLUMNS):
                        print("Column must be between 0 and 6. Try again.")
                        continue
                    if not is_valid_location(board, col):
                        print("Column is full. Choose a different column.")
                        continue

                    row = get_next_open_row(board, col)
                    drop_piece(board, row, col, PLAYER_PIECE)

                    if winning_move(board, PLAYER_PIECE):
                        print_board(board)
                        print("Player 1 wins!")
                        game_over = True
                    break
                except ValueError:
                    print("Invalid input. Please enter a number from 0 to 6.")
        else:
            print("AI is thinking...")
            col, _ = minimax(board, 5, -math.inf, math.inf, True)

            if col is not None and is_valid_location(board, col):
                row = get_next_open_row(board, col)
                drop_piece(board, row, col, AI_PIECE)

                if winning_move(board, AI_PIECE):
                    print_board(board)
                    print("AI wins!")
                    game_over = True

        print_board(board)

        if not game_over and len(get_valid_locations(board)) == 0:
            print("It's a tie!")
            game_over = True

        turn = PLAYER_PIECE if turn == AI_PIECE else AI_PIECE

if __name__ == "__main__":
    play_game()