import pygame, sys
from Grid import Grid
import time

dead_color = 0,0,0
alive_color = 255, 255, 255
board_size = WIDTH, HEIGHT = 625,900
class Game:

    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode(board_size)
        self.grid = Grid()
        self.oldGrid = Grid()
        self.clear_screen()

    def clear_screen(self):
        self.screen.fill(dead_color)

    def fill_grid(self):
        for i in range((len(self.grid.grid))):
            for j in range(len(self.grid.grid)):
                if self.grid.grid[i][j] == 1:
                    pygame.draw.rect(self.screen, alive_color,[(5 + 20) * j + 5,
                              (5 + 20) * i + 5,20,20])
                    pygame.display.flip()
                else:
                    pygame.draw.rect(self.screen, alive_color,[(5 + 20) * j + 5,
                              (5 + 20) * i + 5,20,20], 1)
                    pygame.display.flip()
    def update_gen(self):
        # inspect current active gen
        # update inactive grid and store next gen
        # swap out active grid
        leng = len(self.grid.grid)
        for row in range(leng):
            for col in range(leng):
                state = self.grid.grid[row][col]

                if row == 0 or col == 0 or row == leng-1 or col == leng-1:
                    self.oldGrid.grid[row][col] = state
                else:
                    neighbors = self.grid.countNeighbors(row, col)
                    if state == 0 and neighbors == 3:
                        self.oldGrid.grid[row][col] = 1
                    elif state == 1 and (neighbors < 2 or neighbors > 3):
                        self.oldGrid.grid[row][col] = 0
                    else:
                        self.oldGrid.grid[row][col] = state
        self.grid.grid = self.oldGrid.grid

                
                

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT: sys.exit()
            elif event.type == pygame.MOUSEBUTTONDOWN:
                pos = pygame.mouse.get_pos()
                col = pos[0] // 25
                row = pos[1] // 25

                try:
                    self.grid.grid[row][col] = 1
                except:
                    print("Must not be clicking on this cheif, maybe put buttons here")
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_q:
                    break
                if event.key == pygame.K_s:
                    self.update_gen()
                    break
                if event.key == pygame.K_c:
                    self.clear_screen()
                    self.grid.clearGrid()
                    self.grid.create_cells()
                    self.oldGrid.grid = self.grid.grid


    def run(self):
        self.clear_screen()
        self.grid.create_cells()
        self.oldGrid.grid = self.grid.grid
        pygame.display.flip()
        # self.create_grid()

        while True:
            self.handle_events()
            self.fill_grid()
            pygame.display.flip()




if __name__ == '__main__':
    game = Game()
    game.run()