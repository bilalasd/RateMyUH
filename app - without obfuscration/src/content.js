$(document).ready(function () {

    //console.log("document is ready");

    //LOOK FOR CHANGES
    var observer = new MutationSummary({
        callback: handleChanges,
        queries: [{
            attribute: "class"
        }]
    });
});


function handleChanges() {

    var firstName = [];
    var lastName = [];
    var proflength;
    var totalProfsSplit;
    var ratings;

    // console.log("change occured");


    //FIND TOTAL NUMBER OF PROFS AND ADD THE FIRST NAMES AND LAST NAMES INTO ARRAYS

    var totalProfs = $('#ptifrmtgtframe').contents()
                 .find("[id^='MTG_INSTR']") //Find the spans
                 .map(function () { return this.innerText; }) //Project Ids
                 .get(); //ToArray
    //console.log(totalProfs.length);


    if (totalProfs.length != 0) {


        for (i = 0; i < totalProfs.length; i++) {
            totalProfsSplit = totalProfs[i].split(" ");
            proflength = totalProfsSplit.length - 1;

            firstName[i] = totalProfsSplit[0];
            lastName[i] = totalProfsSplit[proflength];
            console.log(firstName.length);

            //EXCEPTIONS TO NAMES
            if (firstName[i] == 'David' && lastName[i] == 'Shattuck') {
                firstName[i] = 'Dave';
            }



        }


        //GET THE RATING BY SENDING A REQUEST TO THE URL
       /* var query = '';
        for (i = 0; i < firstName.length; i++) {
            query = query + 'proffirst[]=' + firstName[i] + '&proflast[]=' + lastName[i] + '&'
        }*/

        var query = '';
        var query1 = '';
        var query2 = '';
        var query3 = '';
        var query4 = '';

        query1 = 'proffirst=';

        for (i = 0; i < firstName.length; i++) {
            if (i == firstName.length - 1) {
                query2 = query2 + firstName[i];

            }
            else
            {
                query2 = query2 + firstName[i] + ',';

            }
        }

        query3 = '&proflast=';

        for (i = 0; i < firstName.length; i++) {
            if (i == lastName.length - 1) {
                query4 = query4 + lastName[i];

            }
            else {
                var query4 = query4 + lastName[i] + ',';

            }

        }
        query = query1 + query2 + query3 + query4;



        console.log(query);

        var url = "http://testing.coffeeviews.net/lookup.php?" + query;
        url = encodeURIComponent('select * from json where url="' + url + '"');
        url = "https://query.yahooapis.com/v1/public/yql?q=" + url + "&format=json";


       // $(".PSLEVEL1GRIDWBO").width("650");
       // $(".PSLEVEL1SCROLLAREABODY").width("700")



        //console.log(url);
        $.ajax({
            type: 'POST',
            async: true,
            url: url,
            success: function (data) {

                //create header
                var rowsHeader = $('#ptifrmtgtframe').contents().find(".PSLEVEL1GRIDWBO").find('tr:not([id])');
                rowsHeader.append('<th scope="col" abbr="?Overall Rating" width="125" align="left" class="PSLEVEL1GRIDCOLUMNHDR"><a class="PSLEVEL1GRIDCOLUMNHDR" id="headercustom" href="">Overall Rating</a></th>');
                rowsHeader.append('<th scope="col" abbr="Easiness" width="125" align="left" class="PSLEVEL1GRIDCOLUMNHDR"><a class="PSLEVEL1GRIDCOLUMNHDR" id="headercustom" href="">Easiness</a></th>');
                rowsHeader.append('<th scope="col" abbr="Reviews" width="125" align="left" class="PSLEVEL1GRIDCOLUMNHDR"><a class="PSLEVEL1GRIDCOLUMNHDR" id="headercustom" href="">Reviews</a></th>');

                //create rows
                $('#ptifrmtgtframe').contents().find("[id^='trSSR_CLSRCH_MTG']").each(function (i, e) {
                    var revlink = 'https://href.li/?http://www.ratemyprofessors.com/ShowRatings.jsp?tid=' + data.query.results.json.tid[i];
                    //console.log(data.query.results.json.rating[0]);

                    if (data.query.results.json.rating[i] == 'Not Found')
                    {
                        $(e).append('<td align="center" class="PSLEVEL1GRIDODDROW"><span class="PSEDITBOX_DISPONLY" >Not Found</span></td>');
                        $(e).append('<td align="center" class="PSLEVEL1GRIDODDROW"><span class="PSEDITBOX_DISPONLY" >Not Found</span></td>');
                        $(e).append('<td align="center" class="PSLEVEL1GRIDODDROW"><span class="PSEDITBOX_DISPONLY" >N/A</span></td>');

                    }
                    else {
                        $(e).append('<td align="center" class="PSLEVEL1GRIDODDROW"><span class="PSEDITBOX_DISPONLY" >' + data.query.results.json.rating[i] + '</span></td>');
                        $(e).append('<td align="center" class="PSLEVEL1GRIDODDROW"><span class="PSEDITBOX_DISPONLY" >' + data.query.results.json.easiness[i] + '</span></td>');
                        $(e).append('<td align="center" class="PSLEVEL1GRIDODDROW"><a target="_blank" href="' + revlink + '" class="PSEDITBOX_DISPONLY" >Click Here</a></td>');

                    }

                });


            }

        });

    }
}
