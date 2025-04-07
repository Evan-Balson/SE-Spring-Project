const mapController = () => {
    document.addEventListener('DOMContentLoaded', function() {
      const postcodeInput = document.getElementById('postcode');
      const addressInput = document.getElementById('addressSearch');
      
      postcodeInput.addEventListener('blur', function() {
        const postcode = postcodeInput.value;
        
        if (postcode) {
          fetchAddressByPostcode(postcode);
        }
      });
      
      function fetchAddressByPostcode(postcode) {
       
         // Using OpenStreetMap's API to fetch map data
        const url = 'https://api.openstreetmap.org/api/0.6/map?bbox=-0.489,-0.123,0.236,51.569';
  
        fetch(url)
          .then(response => response.text()) // Text response for XML data
          .then(xml => {
            // Parse the XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");
            const nodes = xmlDoc.getElementsByTagName("node");
  
            // Example: Process nodes (can be modified based on the specific use case)
            if (nodes.length > 0) {
              // Just an example: log the first node's ID and its coordinates
              const firstNode = nodes[0];
              const nodeId = firstNode.getAttribute("id");
              const nodeLat = firstNode.getAttribute("lat");
              const nodeLon = firstNode.getAttribute("lon");
              console.log(`Node ID: ${nodeId}, Latitude: ${nodeLat}, Longitude: ${nodeLon}`);
  
              // Populate the address input with some node data (if relevant to your use case)
              addressInput.value = `${nodeLat}, ${nodeLon}`; // Just an example, can be customized
            } else {
              console.log("No nodes found within the given bounding box.");
            }
          })
          .catch(err => {
            console.error('Error fetching map data:', err);
            alert('There was an error while fetching the map data.');
          });
      }
    });
  };
  
  // Export mapController as a module
  module.exports = { mapController };
  