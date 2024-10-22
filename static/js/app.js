
// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    //console.log(sample); //To troubleshoot issues

    // get the metadata field
    const metadata = data.metadata;
    //console.log(metadata); //To troubleshoot issues

    // Filter the metadata for the object with the desired sample number
    const filteredMetadata = metadata.find(item => item.id === Number(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select(`#sample-metadata`).html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      const upperCaseKey = key.toUpperCase();
      //console.log(`Key: ${upperCaseKey}, Value: ${value}`); //To troubleshoot issues
      d3.select("#sample-metadata")
        .append("h8")
        .html(`<strong>${upperCaseKey}:</strong> ${value} <br>`);
    });

  });
}



// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    //console.log(sample); //To troubleshoot issues

    // Get the samples field
    const sample_data = data.samples;
    //console.log(sample_data); //To troubleshoot issues

    // Filter the samples for the object with the desired sample number
    let filteredSampleData = sample_data.find(item => item.id === sample);
    //console.log(JSON.stringify(filteredSampleData, null, 2)); //To troubleshoot issues

    // Get the otu_ids, otu_labels, and sample_values
    const otuID = filteredSampleData.otu_ids;
    const sampleValue = filteredSampleData.sample_values;
    const otuLabel = filteredSampleData.otu_labels;
    
    // Build a Bubble Chart
    var trace1 = {
      x: otuID,
      y: sampleValue,
      text: otuLabel,
      mode: 'markers',
      marker: {
        size: sampleValue.map(value => value * 0.75),
        color: otuID,
        colorscale: 'Viridis'
      }
    };
    
    var data_bubble = [trace1];
    
    var layout_bubble = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID'},
      yaxis: { title: 'Number of Bacteria'},
      showlegend: false,
      width: 1300
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', data_bubble, layout_bubble);

    // Build Top 10 Data
    let combinedData = otuID.map((id, index) => ({
      otuID: id,
      sampleValue: sampleValue[index],
      otuLabel: otuLabel[index]
    }));

    let sortData = combinedData.sort((a, b) => b.sampleValue - a.sampleValue);
    let top10Data = sortData.slice(0, 10);
    let finalData = top10Data.reverse()

    let finalSampleValues = finalData.map(data => data.sampleValue);
    let finalotuLabel = finalData.map(data => data.otuLabel)
    let PrettyOTUID = finalData.map(data => `OTU ${data.otuID}`);

    // Build a Bar Chart
    var trace2 = {
      type: 'bar',
      x: finalSampleValues,
      y: PrettyOTUID,
      text: finalotuLabel,
      orientation: 'h'
    }

    var data_bar = [trace2]

    var layout_bar = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria'}
    }

    // Render the Bar Chart
    Plotly.newPlot('bar', data_bar, layout_bar)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {

    // Get the names field
    let names = data.names;
    //console.log(data.names); //To troubleshoot issues

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    names.forEach(function(name) {
      dropdownMenu.append("option")
        .text(name)
        .property("value", name);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    optionChanged(firstSample);
});
}

// Function for event listener
function optionChanged(newSample) {
  //console.log("Selected sample:", newSample); //To troubleshoot issues
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();

