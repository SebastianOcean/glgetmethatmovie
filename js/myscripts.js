$(document).ready(function () {


  /////////////////////////// Declare general variables ///////////////////////////

	var api_key,
		img_base_url,	//the base url for the API's images
		search_query,	//the current value of the search input 
		$results_container,	//points to the html container where the results will be displayed 
		pages = {
			page_number : 1,
			number_of_pages: 1
			};




  /////////////////////////// Declare functions ///////////////////////////


	(function(){
	// Self-executing anonymous function initializes general components

		api_key = '42b5ff0dac4f85d35326ee0cdf58f291';

		search_query = $('#search_input').val();

		$results_container = $('#results_display');

		//makes a single request to the API to get the base_url used to build the movie posters paths
		$.getJSON('http://api.themoviedb.org/3/configuration', {
			'api_key' : api_key
		}, function(data){
			img_base_url = data.images.base_url;
		});
	})();


	function get_moviedb_result(query, build_movie_list, pages){
	//Function making the AJAX request to the movieDB API, finally builds the result using the function build_movie_list

		var requestURL = 'http://api.themoviedb.org/3/search/movie';

		// collect the data
		$.getJSON(requestURL, {
			'api_key'	: api_key,
			'query' 	: query,
			'page'		: pages.page_number
		}, function(data){

			pages.number_of_pages = data.total_pages;

			//use the function passed as an argument to build de list
			build_movie_list(query, data.results, data.total_results, pages);
		});
	}


	function build_basic_movie_list(query, sresults, total_results, pages){
	//Builds the API response in the $results_container

		if (total_results > 0) {

			var search_result = '';

			$.each(sresults, function(i, movie) {

				if (movie.poster_path===null){img_url='img/no_poster.png';}
				else {img_url=img_base_url + 'w300' + movie.poster_path;}

				search_result += '<li>';
				search_result += movie.original_title;
				if (movie.release_date!==null && movie.release_date!=="") 
					{search_result += '<span class="year_small"> (' + movie.release_date.substring(0, 4) + ')</span>';}
				search_result += '</li>';
				$results_container.html(search_result);

			});

			$results_container.html(search_result);
		} else {
			$results_container.html('<li>No movie found for " ' + query + '".</li>');
		}
	}

	var build_extended_movie_list = function(query, sresults, total_results, pages){
		show_thumbs = true;
		if (total_results > 0) {
						$('#wrapper').css({'top': '10px'});
				var img_url;
				var search_result = '<em>Here are your Movies:</em>';

				$.each(sresults, function(i, movie) {
					if (movie.poster_path===null){img_url='img/no_poster.png';}
					else {img_url=img_base_url + 'w300' + movie.poster_path;}


					search_result += '<p>';
					if (show_thumbs) {
						search_result += '<img src="' + img_url;
						search_result += '" style="width:30px;"></img>';
					}
					search_result += movie.original_title;
					if (movie.release_date!==null) 
						{search_result += ' (' + movie.release_date.substring(0, 4) + ')';}
					search_result += '</p>';
					$results_container.html(search_result);
				});

				search_result += '<em>End of the results</em>';

				$results_container.html(search_result);
			} else {
				$results_container.html('<em>No movie found for " ' + query + '". Please try again.</em>');
			}
	}


	function basic_list_transition(){
		$('#search_input').css({'border-bottom-left-radius': '0'});
		$('#submit_button').css({'border-bottom-right-radius': '0'});
		$('#results_display').css({'display': 'block'});
		$('#wrapper').css({'top': '40%'});
	}




  /////////////////////////// Events ///////////////////////////


	//Manage the clear_bttn button events, keeping focus on the field, and clearing it if clicked
	$('#clear_bttn').mousedown(function(e){
		e.preventDefault();
		$('#search_input').focus();
	});

	$('#clear_bttn').click(function(e){
		e.preventDefault();
		$('#search_input').val('');
		$('#search_input').focus();
		$('#search_input').keyup();
	});
	
	$('#search_input').keypress(function(e){
		$('#results_display li').css({'opacity': '0'});
	});


	//Listens to KEYUP event for the input typed, updating the quick search results
	$('#search_input').keyup(function(e){		

		search_query = $('#search_input').val();

		if (search_query !== ''){
					
			basic_list_transition();
			pages.page_number = pages.number_of_pages = 1; 

			get_moviedb_result(search_query, build_basic_movie_list, pages);
			
		} else{
			$('#results_display').html('<li>the results will be displayed here</li>');
		}
	});


	//Activates the result display on SUBMIT of the input
	$('#search_form').submit(function(e){	
		e.preventDefault();

		$('#search_input').blur();

		search_query = $('#search_input').val();
		$results = $('#results_display'); // ???
	if (search_query !== ''){
		
		pages.page_number = pages.number_of_pages = 1; 

		get_moviedb_result(search_query, build_extended_movie_list, pages);
		
	} else{
		$('#results_display').html('<li>the results will be displayed here</li>');
	}
	});


});

