/*
Copyright [2009-2016] EMBL-European Bioinformatics Institute
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Look up Pubmed IDs in the Rfam database to highlight papers that have and
 * and haven't been added to Rfam yet.
 */

(function () {

    var API_KEY = 'AIzaSyCUi-de7G-UgwvJlQWBGcyE91Z0FtaKRiA',
        SPREADSHEET_ID = '1h-bjALegIWRT4AgydTIWWa4Si3JWOGY9u0kQ8iuNk7E',
        RANGE = 'PMIDs!E2:E',
        url = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + RANGE + '?key=' + API_KEY;

    jQuery.getJSON(url, function (data) {
        var rfam_ids = process_rfam_ids(data),
            pubmed_ids = get_pubmed_id_elements();
        highlight_pubmed_ids(rfam_ids, pubmed_ids);
    });

    /**
     * Process Google API response object into a flat array.
     */
    function process_rfam_ids(data) {
      var rfam_ids = [],
          arrayLength = data.values.length,
          i;
      for (i = 0; i < arrayLength; i++) {
          rfam_ids.push(data.values[i][0]);
      }
      return rfam_ids;
    }

    /**
     * Find HTML elements with Pubmed IDs.
     */
    function get_pubmed_id_elements() {
        return jQuery('.rprtid > dd');
    }

    /**
     * Apply styles to Pubmed ids found on the page.
     */
    function highlight_pubmed_ids(rfam_ids, pubmed_ids) {
        pubmed_ids.each(function(){
            var $this = $(this),
                pubmed_id = $this.text().replace(/ /g,'');

            if (!pubmed_id.match(/\d+/)) {
                return true;
            }

            console.log(jQuery.inArray('27298343', rfam_ids));

            if (jQuery.inArray(pubmed_id, rfam_ids) === -1) {
                $this.addClass('rfam-pubmed-id not-in-rfam').
                      html(pubmed_id + ' - Add to Rfam?');
            } else {
                $this.addClass('rfam-pubmed-id found-in-rfam').
                      html(pubmed_id + ' - Already analyzed');
            }
            $this.css('padding', '0px 5px');
        });
    }

}).call(this);
