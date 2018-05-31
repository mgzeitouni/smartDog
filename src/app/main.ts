import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
Amplify.configure(awsmobile);

platformBrowserDynamic().bootstrapModule(AppModule);
