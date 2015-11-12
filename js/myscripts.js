$(document).ready(function () {

	"use strict"; 

  /////////////////////////// Declare general variables ///////////////////////////

	var api_key,
		img_base_url,		//the base url for the API's images
		search_query,		//the current value of the search input 
		$results_container,	//points to the html container where the results will be displayed 
		pages = {
			page_number : 1,
			number_of_pages: 1
			};




  /////////////////////////// Declare functions ///////////////////////////


	(function(){
	// Self-executing anonymous function initializes general components

		api_key = '42b5ff0dac4f85d35326ee0cdf58f291';
		
		$('#search_input').val('');

		$results_container = $('#results_display');

		//makes a single request to the API to get the base_url used to build the movie posters paths
		$.getJSON('http://api.themoviedb.org/3/configuration', {
			'api_key' : api_key
		}, function(data){
			img_base_url = data.images.base_url;
		}).error(function(){
			basic_list_transition();
			$results_container.html('<li><small>Error connecting to themoviedb\'s API</small></li>');
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
		}).error(function(){
			basic_list_transition();
			$results_container.html('<li><small>Error connecting to themoviedb\'s API</small></li>');
		});
	}


	function build_basic_movie_list(query, search_results, total_results, pages){
	//Builds the API response in the $results_container, as a simple list

		if (total_results > 0) {

			var s_r = ''; //will handle the html output

			$.each(search_results, function(i, movie) {

				s_r += '<li class="list_element">';
				s_r += '<em class="movie_title">';
				s_r += movie.original_title;
				s_r += '</em>';
				if (movie.release_date!==null && movie.release_date!=="") 
					{s_r += '<span class="year"> (' + movie.release_date.substring(0, 4) + ')</span>';}
				s_r += '</li>';
				$results_container.html(s_r);

			});

			$results_container.html(s_r);
		} else {
			$results_container.html('<li> <small>No movie found for "' + query + '".</small></li>');
		}
	}

	var build_extended_movie_list = function(query, search_results, total_results, pages){
	//Builds the API response in the $results_container, as an enhanced list
		if (total_results > 0) {			

			var img_url,
			 	s_r = ''; //will handle the html output

			$.each(search_results, function(i, movie) {

				if (movie.poster_path!==null){img_url='img/no_poster.png';}

				s_r += '<li class="list_element">';
					s_r += '<span class="movie_image_box">';
						if (movie.poster_path!==null){
							img_url = img_base_url + 'w300' + movie.poster_path;
							s_r += '<img class="movie_image" src="' + img_url + '"></img>';}
					s_r += '</span>';
					s_r += '<em class="movie_title" style="max-width:none;">';
						s_r += movie.original_title;
					s_r += '</em>';
					if (movie.release_date!==null && movie.release_date!=="") 
						{s_r += '<span class="year"> (' + movie.release_date.substring(0, 4) + ')</span>';}
					if (movie.overview!==null && movie.overview!=="") 
						{s_r += '<p class="overview"> "' + movie.overview + '"</p>';}
				s_r += '</li>';

				$results_container.html(s_r);

			});

			if(pages.number_of_pages > 1) {
				s_r += '<span id="pages">';
				var page_n = parseInt(pages.page_number)-1;
				if(page_n > 0){
					s_r += '<a href="#" id="prev_page">&#8592; ' + page_n + '/' + pages.number_of_pages + '</a>';
				}
				var page_n = parseInt(pages.page_number)+1;
				if(page_n < pages.number_of_pages){
					s_r += '<a href="#" id="next_page">' + page_n + '/' + pages.number_of_pages + ' &#8594;</a>';
				}
				s_r += '<br/>Page ' + pages.page_number;				
				s_r += '</span>';
			}

			$results_container.html(s_r);
		} else {
			$results_container.html('<li><small>No movie found for "' + query + '".</small></li>');
		}
	}


	//functions editing the css/html from one view to an other
	function basic_list_transition(){
		$('body').css({'overflow': 'hidden'});
		$('#search_input').css({'border-bottom-left-radius': '0'});
		$('#submit_button').css({'border-bottom-right-radius': '0'});
		$('#results_display').css({'display': 'block'});

		$('#results_display').css({'font-size': '1em'})				
		$('#wrapper').css({'top': '40%'});
		$('#results_display').css({'width': '240px'});
		$('#search_form').css({'width': '240px'});
		$('#search_input').css({'width': '153px'});
	}

	function extended_list_transition(){
		$('body').css({'overflow': 'auto'});
		$('#results_display').css({'font-size': '1.2em'})
		$('#wrapper').css({'top': '10px'});
		$('#results_display').css({'width': '400px'});
		$('#search_form').css({'width': '400px'});
		$('#search_input').css({'width': '273px'});
	}
		
	function reset_search_input(){
		basic_list_transition();
		$('#search_input').val('');
		$('#results_display').html('');
		$('#search_input').css({'border-bottom-left-radius': '5px'});
		$('#submit_button').css({'border-bottom-right-radius': '5px'});
		$('#search_input').focus();
	}




  /////////////////////////// Events ///////////////////////////


	//Manage the clear_bttn button events, keeping focus on the field, and clearing it if clicked
	$('#clear_bttn').mousedown(function(e){
		e.preventDefault();
		$('#search_input').focus();
	});

	$('#clear_bttn').click(function(e){

		$('#clear_bttn').mouseleave();

		e.preventDefault();

		reset_search_input();
	
	});
	

	//blurs the results when a key is pressed, as a transition
	$('#search_input').keypress(function(e){
		$('#results_display li').css({'opacity': '0'});
	});


	//Listens to KEYUP event for the input typed, updating the quick search results
	$('#search_input').keyup(function(){		

		search_query = $('#search_input').val();

		if (search_query !== ''){
					
			basic_list_transition();
			pages.page_number = pages.number_of_pages = 1; 

			get_moviedb_result(search_query, build_basic_movie_list, pages);
			
		} else{
			reset_search_input();
		}
	});


	//Activates the result display on SUBMIT of the input
	$('#search_form').submit(function(e){	
		e.preventDefault();

		$('#search_input').blur();

		search_query = $('#search_input').val();

		if (search_query !== ''){
			$('#submit_button').mouseout();

			extended_list_transition();
			pages.page_number = pages.number_of_pages = 1; 

			get_moviedb_result(search_query, build_extended_movie_list, pages);
			
		} else{
			basic_list_transition();
			$('#results_display').html('<li><small>the results will be displayed here</small></li>');
		}
	});


	//Calls the next page when the button is clicked
	$(document).on('click', '#next_page', function(e){	
		e.preventDefault();

		extended_list_transition();

		++pages.page_number; 

		window.scrollTo(0,0);

		get_moviedb_result(search_query, build_extended_movie_list, pages);

	});


	//Calls the previous page when the button is clicked
	$(document).on('click', '#prev_page', function(e){	
		e.preventDefault();

		extended_list_transition();

		--pages.page_number; 

		window.scrollTo(0,0);

		get_moviedb_result(search_query, build_extended_movie_list, pages);

	});

	
	//Search for the movie with selected title, when clicked by the user in the basic list
	$(document).on('click', '.list_element', function(e){	

		search_query = $(this).find('.movie_title').text();

		$('#search_input').val(search_query);

		extended_list_transition();

		if (search_query !== ''){
			
			extended_list_transition();
			pages.page_number = pages.number_of_pages = 1; 

			get_moviedb_result(search_query, build_extended_movie_list, pages);
			
		} else{
			$('#results_display').html('<li><small>the results will be displayed here</small></li>');
		}

	});

});