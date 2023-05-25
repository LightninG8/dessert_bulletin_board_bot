import { Scene } from 'nestjs-telegraf';
import { SCENES } from 'src/commonConstants';

@Scene(SCENES.I_AM_CONSUMER_SCENE)
export class IAmConsumerScene {}
