/**
 * Generic "Selectable Items" Lightning Web Component for OmniScript
 * 
 * 
 * @author Kirk Leibert <kleibert@vlocity.com>
 * @author Charles McGuinness <cmcguinness@vlocity.com>
 * 
 */
import { LightningElement, track, api } from 'lwc';

import { OmniscriptBaseMixin } from 'vlocityins2/omniscriptBaseMixin';

export default class lwcsi01 extends OmniscriptBaseMixin(LightningElement) {


    @track data = {};
    @track vals = [];
    @track cols = [];
    @track headers = [];
    @track displayRows = [];
    @api title = '';
    @api multiselect;


    @track parms_showSelect = true;
    parms_headers = null;
    parms_values = null;
    parms_input = null;


    /*  *****************************************************************   */
    /*  Initialization Section of code                                      */
    /*  *****************************************************************   */


    /**
     * This method is called automatically when the LWC is ready to be
     * initialized.  It calls, in sequence, the methods used to create
     * both the data shown in the UI as well as backing data.
     */
    connectedCallback() {
        this.parseParams();
        this.parseHeaders();
        this.generateData();
    }


/*

		tableSearch(){
				let input, filter, table, tr, td, txtValue;
				
				//initialising variables
				
				
				filter = input.value.toUpperCase();
				console.log(filter)
				table = this.template.querySelector(".myTable");
				tr = this.template.querySelector("tr");
				console.log(tr);
				for(let i=0; i < tr.length; i++){
						td = tr[i].querySelector("td")[1];
						if(td){
								txtValue = td.textContent || td.innerText;
								if(txtValue.toUppperCase().indexOf(filter) > -1){
										tr[i].style.display = ""
								}
								else{
										tr[i].style.display = "none";
								}
						}
				}
		}
		*/





    /**
     * Get the parameters for the LWC which have been pased in from the OmniScript as metadata
     * The parameters are passed in the definition of the element, and are held in an unordered
     * array called customAttributes.  Each element of the array is an object which has a key:value
     * pair.  The key is called "name", while the value is called "source".
     * 
     * We loop through the array, comparing the name to things we're looking for and, when matched,
     * saving the value into a module level variable for reference elsewhere. 
     */

    parseParams() {

        let parms = this.omniJsonDef.propSetMap.customAttributes;

        //  Find the values in the list (don't want to be fussy about the order)
        parms.forEach((val) => {
            if (val.name === "headers") {
                this.parms_headers = val.source;
                console.log('Headers = ' + this.parms_headers);
            }

            if (val.name === 'values') {
                this.parms_values = val.source;
                console.log('Values = ' + this.parms_values);
            }

            if (val.name === 'input') {
                this.parms_input = val.source;
                console.log('Input @ ' + this.parms_input);
            }

            if (val.name === 'select') {
                // Note that select defaults to true
                let s = val.source.toUpperCase();
                if (s === 'F' || s === 'FALSE' || s === 'N' || s === "NO") {
                    this.parms_showSelect = false;
                }
                console.log('Select = ' + String(this.parms_showSelect));
            }

        });

    }

    /**
     * Retrieve the titles (headers) of the columns.  
     * 
     * We expect the custom parameter "headers" to hold the titles in a simple
     * comma-separated list.
     */

    parseHeaders() {
        (this.parms_headers.split(',')).forEach((item, i) => {
            var x = {};
            x.key = i;
            x.value = item.trim();  // Don't want leading / trailing spaces
            this.headers.push(x);
        });
        console.log('Headers: ' + JSON.stringify(this.headers));
    }

    /**
     * Generates the data portion of the table
     */
    generateData() {

        //  Get the names of the values to displau
        let values_list = this.parms_values.split(',');

        let tempRows = JSON.parse(JSON.stringify(this.omniJsonData[this.parms_input]));
			//	console.log("tempRows -- " + tempRows);


        tempRows.forEach((item, i) => {
						//console.log(item)
            item.tagname = "cb_" + i;
            item.rowid = i;
            item.checked = false;
            item.filtered = false;
						item.boolFilter = true; //add vy
            item.columns = [];
            values_list.forEach((name,i2) => {
                let c = {}
                c.key = i2;
                c.value = item[name];
                item.columns.push(c);
            });
            this.displayRows.push(item);
        });
				
				

        // use this code for 107.1 and above
        //this.vals = this.omniJsonData[this.parms_input];
        //this.cols = this.omniJsonData[this.omniJsonDef.name].cols;
        // use this code for 107 and below
        //this.vals = this.omniSeedJson[this.omniJsonDef.name].vals;
        //this.cols = this.omniSeedJson[this.omniJsonDef.name].cols;      

        //console.log("omniJsonData");
        //console.log(JSON.stringify(this.omniJsonData));
        //console.log("omniJsonDef");
        //console.log(JSON.stringify(this.omniJsonDef));
        //console.log("omniSeedJson");
        //console.log(JSON.stringify(this.omniSeedJson));
        //console.log(JSON.stringify(this.vals));
        //console.log(JSON.stringify(this.cols));
        //console.log('Display Rows: ');
        //console.log(JSON.stringify(this.displayRows));
    }
		

		/*
		 @author Victor yuzo
		 This method is called when the lightning input is used to search through the selectable items
		*/
		 generateFilterData(searchKey) {
				
			//	console.log(JSON.stringify(this.displayRows));
			//	this.displayRows = [];
        //  Get the names of the values to displau
       // let values_list = this.parms_values.split(',');

        //let tempRows = JSON.parse(JSON.stringify(this.omniJsonData[this.parms_input]));
				let tempRows = JSON.parse(JSON.stringify(this.displayRows));
			//	console.log(tempRows)
		
				let boolFilter = false;
				this.displayRows = [];
				
        tempRows.forEach((item, i) => {
					//console.log(item);

						boolFilter = false;
						
						if(item.checked == true){
										boolFilter = true;
								}
						
						let arrayValues = Object.values(item);
					//	console.log(arrayValues);
						
						for(let value of arrayValues){
								
								
								
								
								if(typeof value === "string" ){
										if(value.toLowerCase().includes(searchKey.toLowerCase())){
										boolFilter = true;
												//console.log(value.checked)
								}								
								}
						}
						
						 
						//let nameFilter = (item.Name).toLowerCase();
						// nameFilter.startsWith(searchKey.toLowerCase()
						
								//item.tagname = "cb_" + i;
								//item.rowid = i;
								//item.checked = false;
								//item.filtered = false;
								//item.columns = [];
								item.boolFilter = boolFilter;
								/*values_list.forEach((name,i2) => {
										let c = {}
										c.key = i2;
										c.value = item[name];
										item.columns.push(c);
								});*/
						
            this.displayRows.push(item);
						
        });

		 }

    /*  *****************************************************************   */
    /*  Runtime Section of code                                             */
    /*  *****************************************************************   */


    filterSelectedFromList(list) {
        const filteredList = list.filter(
            // eslint-disable-next-line no-undef
            checked = true
        );
        return filteredList
    }

    selectRow(event) {
        const selected = event.target.checked;
        const target = event.target.name;
        // eslint-disable-next-line radix
        const iteration = parseInt(target.substring(3, target.length));
        this.displayRows[iteration].checked = selected;
    }

    getRows() {
        let data = [];
        let filtered = [];
				
        data = this.displayRows;
        filtered = data.filter(function (item) {
            return item.checked === true;
        });
        return filtered;
    }

    handleSelection(event) {
        this.selectRow(event);
        this.omniUpdateDataJson(this.getRows());
    }
		
		/*
		@author Victor Yuzo
		Used to handle the input in the lightning input
		*/
		handleKeyChange( event ) {  
          
        const searchKey = event.target.value.toLowerCase();  
        //console.log( "Search Key is " + searchKey );
				this.generateFilterData(searchKey);

		}
}