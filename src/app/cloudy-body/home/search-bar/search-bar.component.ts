import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';  
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { CommonModule } from '@angular/common'; 
import { ApiServiceService } from '../../../api-service.service';
import { HomeService } from '../home.service';


@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit{
myForm: FormGroup;

stopDropdownOptions: any = [];

constructor(private apiService: ApiServiceService, private homeService: HomeService) {

  this.myForm = new FormGroup({
    source: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
  });
  
}

ngOnInit() {
  this.getDropdownOptions();
}

getDropdownOptions = async () => {
  let apiResponse = await this.apiService.fetchAllStops();
  this.stopDropdownOptions = apiResponse;
}

onSubmit() {
  this.homeService.updateStopSelection(this.myForm.value);
}
}
