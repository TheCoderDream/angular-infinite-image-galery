import { ChangeDetectorRef, Component, HostListener,  OnInit } from '@angular/core';
import { AppService } from './app.service';

function debounceTime(timeInMilisecond, cb) {
  let timeOutId;

  return () => {
    timeOutId && clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      cb();
    }, timeInMilisecond);
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  images: Array<any> = [];
  query = '';
  page = 1;
  loading = false;

  constructor(private appService: AppService, private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    await this.getImages();
  }

  searchImagesByQuery = debounceTime(500, async () => {
    this.page = 1;
    await this.getImages();
  });
  
  @HostListener('window:scroll')
  async onScroll(): Promise<void> {
    if (window.innerHeight + window.scrollY + 100 >= document.body.offsetHeight && !this.loading) {
      ++this.page;
      await this.getImages(() => --this.page);
    }
  }

  private async getImages(errCb?: Function) {
    try {
      this.loading = true;
      const imagesFromApi = await this.appService.getPhotos(this.page, this.query).toPromise();
      const images = imagesFromApi.results ?? imagesFromApi;
      if (this.page === 1) this.images = images;
      else this.images = this.images.concat(images);
      this.cdr.detectChanges();
    } catch(e) {
      errCb && errCb();
      console.log(e);
    } finally {
      this.loading = false;
    }
  }

}
