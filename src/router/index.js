import { createRouter, createWebHistory } from 'vue-router'
import HomeData from '../components/HomeData.vue';
import LoginForm from '../components/LoginForm.vue';
import SignupForm from '../components/SignupForm.vue';
import ForgotPinForm from '../components/ForgotPinData.vue';
import PuzzleGame from '../components/Games/PuzzleGames.vue';
import PuzzleGamesFirstSlides from '../components/Games/PuzzleGamesFirstSlides.vue';
import LudoGameFirstSlides from '../components/Games/LudoGamesFirstSlides.vue';
import LudoGame from '../components/Games/LudoGames.vue';
import SnakeGame from '../components/Games/SnakeGames.vue';
import SnakeGameFirstSlides from '../components/Games/SnakeLadderFirstSlides.vue';
import QuizGameFirstSlides from '../components/Games/QuizGamesFirstSlides.vue';
import CandyGameFirstSlides from '../components/Games/CandyGamesFirstSlides.vue';
import DoodleGameFirstSlides from '../components/Games/DoodleGamesFirstSlides.vue';
import JackGameFirstSlides from '../components/Games/BlackJackGamesFirstSlides.vue';
// import PongMasterGameFirstSlides from '../components/Games/PongMasterGamesFirstSlides.vue';
// import MineSweeperGameFirstSlides from '../components/Games/MineSweeperGamesFirstSlides.vue';
import BreakoutGameFirstSlides from '../components/Games/BreakoutGamesFirstSlides.vue';
import CandyGameWord from '../components/Games/newGames/candy/CandyGamesWord.vue';
import DoodleGameWord from '../components/Games/newGames/doodle/DoodleGamesWord.vue';
import BlackJackGameWord from '../components/Games/newGames/blackjack/BlackJackGamesWord.vue';
import BreakoutGameWord from '../components/Games/newGames/breakout/BreakoutGamesWord.vue';
// import QuestionData from '../components/Games/QuestionData.vue';
import QuizGame from '../components/Games/QuizGames.vue';
import LevelView from '../components/Games/LevelView.vue';

const routes = [
  { path: '/', component: HomeData },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupForm },
  {  path: '/forgotPin/:mobile', name: 'ForgotPin', component: ForgotPinForm, props: true,},
  { path: '/game/puzzle', component: PuzzleGamesFirstSlides },
  { path: '/game/puzzle/start', component: PuzzleGame },
  { path: '/game/ludo', component: LudoGameFirstSlides },
  { path: '/game/ludo/start', component: LudoGame },
  { path: '/game/snake_ladder', component: SnakeGameFirstSlides },
  { path: '/game/snake_ladder/start', component: SnakeGame },
  { path: '/game/quiz', component: QuizGameFirstSlides },
  { path: '/game/quiz/start', component: QuizGame },
  { path: '/game/candy', component: CandyGameFirstSlides },
  { path: '/game/candy/start', component: CandyGameWord },
  { path: '/game/doodle', component: DoodleGameFirstSlides },
  { path: '/game/doodle/start', component: DoodleGameWord },
  { path: '/game/jack', component: JackGameFirstSlides },
  { path: '/game/jack/start', component: BlackJackGameWord},
  // { path: '/game/pong', component: PongMasterGameFirstSlides },
  // { path: '/game/minesweeper', component:MineSweeperGameFirstSlides },
  { path: '/game/breakout', component: BreakoutGameFirstSlides },
  { path: '/game/breakout/start', component: BreakoutGameWord },
  { path: '/level/:levelNo', name: 'LevelView', component: LevelView, props: true,},

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
