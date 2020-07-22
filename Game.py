import pygame, sys
from Grid import Grid

dead_color = 0,0,0
alive_color = 255, 255, 255
board_size = WIDTH, HEIGHT = 900, 900
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
                if self.grid.grid[i][j].state == 1:
                    pygame.draw.rect(self.screen, alive_color,[(5 + 20) * j + 5,
                              (5 + 20) * i + 5,20,20])
                    pygame.display.flip()
                # else:
                #     pygame.draw.rect(self.screen, dead_color,[(5 + 20) * j + 5,
                #               (5 + 20) * i + 5,20,20], 0)
    def update_gen(self):
        # inspect current active gen
        # update inactive grid and store next gen
        # swap out active grid
        pass

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT: sys.exit()

    def run(self):
        self.clear_screen()
        self.grid.create_cells()
        self.oldGrid.grid = self.grid.grid
        pygame.display.flip()
        # self.create_grid()

        while True:
            self.handle_events()
            self.fill_grid()




if __name__ == '__main__':
    game = Game()
    game.run()