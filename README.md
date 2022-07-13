# boomer-or-not-back

## In a nutshell

This server is used to:
- Receive search queries from a front end
- Scrap the Wikipedia page related to search terms
- Serve the relevant scrapped data back to front

## Packages used

- Cheerio: for scraping
- Axios: for queries
- Express + Express Formidable: server management
- Cors

## Routes

### Post route /which-gen

This route require
a search term as a string of text to be used. 
The response from this route is an object containing: 
  - Wikipedia name 
  - Wikipedia picture
  - Wikipedia DoB
  - Which gen does the person belongs to

Start by parsing the search terms. This is very limited and will throw a lot of exceptions. It's based on fact the Wikipedia systematically use routes with First-name_Family-name, with both being capitalized. 

Using axios, we load the response from wikipedia inside a cheerio variable using load. We'll then use Jquery to navigate the virtual DOM created with Cheerio to extract data and and populate the response object.

