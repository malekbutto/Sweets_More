import { Component } from '@angular/core';
import {faFacebook, faGithub, faInstagram, faLinkedin} from '@fortawesome/free-brands-svg-icons'
import { faGift, faLocation, faPhone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  facebookIcon = faFacebook;
  instagramIcon = faInstagram;
  gitHubIcon = faGithub;
  linkedInIcon = faLinkedin;
  phoneIcon = faPhone;
  locationIcon = faLocation;
}
