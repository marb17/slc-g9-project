document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select("#room-booking-overview"),
          margin = { top: 40, right: 20, bottom: 60, left: 50 }, // Increased bottom margin for labels
          containerWidth = window.innerWidth - margin.left - margin.right - 50,
          dateStep = 2; // Step interval for x-axis labels in days

    // Load booking data
    d3.json("../../data/info.json").then(data => {
        console.log("Data loaded:", data); // Debugging: Check if data is loaded

        // Process the data
        const bookings = data.customers.map(d => ({
            room: d.room,
            startDate: new Date(d.date),
            endDate: new Date(new Date(d.date).setDate(new Date(d.date).getDate() + Number(d.duration)))
        }));

        console.log("Processed bookings:", bookings); // Debugging: Check processed data

        // Calculate dynamic height based on the number of rooms
        const numRooms = new Set(bookings.map(d => d.room)).size;
        const roomHeight = 60; // Height per room (adjust as needed)
        const height = numRooms * roomHeight + margin.top + margin.bottom;
        
        const minDate = d3.min(bookings, d => d.startDate); // Earliest start date
        const maxDate = d3.max(bookings, d => d.endDate); // Latest end date
        const dayWidth = 20; // Fixed width per day (adjust as needed)
        const dateRange = (maxDate - minDate) / (1000 * 60 * 60 * 24); // Date range in days
        const width = Math.max(containerWidth, dateRange * dayWidth); // Total width

        // Update SVG height
        svg.attr("width", width + margin.left + margin.right)
           .attr("height", height);

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden");

        // Define scales
        const xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain([...new Set(bookings.map(d => d.room))].sort())
            .range([0, height - margin.top - margin.bottom])
            .padding(0.2);

        console.log("xScale domain:", xScale.domain()); // Debugging: Check xScale domain
        console.log("yScale domain:", yScale.domain()); // Debugging: Check yScale domain

        // Draw axes
        chart.append("g")
            .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(d3.timeDay.every(dateStep)).tickFormat(d3.timeFormat("%b %d")))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        chart.append("g")
            .call(d3.axisLeft(yScale));

        // Draw booking bars
        chart.selectAll(".bar")
            .data(bookings)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.startDate))
            .attr("y", d => yScale(d.room))
            .attr("width", d => xScale(d.endDate) - xScale(d.startDate))
            .attr("height", yScale.bandwidth())
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                    .html(`Room: ${d.room}<br>Start: ${d.startDate.toDateString()}<br>End: ${d.endDate.toDateString()}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mousemove", event => {
                tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));
    }).catch(error => console.error("Error loading data:", error));
});