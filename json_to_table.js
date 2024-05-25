function jsonToTable(json, div, styles) {
    // Helper function to apply styles to an element
    function applyStyles(element, styles) {
        for (const [property, value] of Object.entries(styles)) {
            element.style[property] = value;
        }
    }

    // Helper function to create a flexbox from an array of values
    function createFlexboxFromArray(array) {
        const flexbox = document.createElement('div');
        flexbox.style.display = 'flex';
        flexbox.style.border = '0px solid #ddd'; // Add border to match table style
        flexbox.style.margin = '1px 0'; // Add margin to match table style
        flexbox.style.padding = '8px'; // Add padding to match table style

        array.forEach(value => {
            const item = document.createElement('div');
            item.textContent = value;
            item.style.margin = '5px';
            item.style.border = '1px solid #ddd'; // Add border to items
            item.style.padding = '8px'; // Add padding to items
            item.style.backgroundColor = '#0CAFFF'; // Background color to match table header
            item.style.flex = '0 1 auto'; // Flex properties to align items horizontally

            if (styles && styles.flexItem) {
                applyStyles(item, styles.flexItem);
            }
            flexbox.appendChild(item);
        });

        return flexbox;
    }

    // Helper function to create a table from an array of objects
    function createTableFromArray(array) {
        if (!array.length) return document.createTextNode('Empty Array');

        // Check if the array contains only values (not objects)
        if (array.every(item => typeof item !== 'object' || item === null)) {
            return createFlexboxFromArray(array);
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Default styles
        applyStyles(table, {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '10px 0'
        });

        // Apply custom styles if provided
        if (styles && styles.table) applyStyles(table, styles.table);

        // Create table headers from object keys
        const headers = Object.keys(array[0]);
        const trHead = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            applyStyles(th, {
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#0CAFFF',
                textAlign: 'left',
                color: 'white'
            });
            if (styles && styles.th) applyStyles(th, styles.th);
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);

        // Create table rows from object values
        array.forEach(obj => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                if (Array.isArray(obj[header])) {
                    td.appendChild(createTableFromArray(obj[header]));
                } else if (typeof obj[header] === 'object' && obj[header] !== null) {
                    td.appendChild(createTableFromObject(obj[header]));
                } else {
                    td.textContent = obj[header];
                }
                applyStyles(td, {
                    border: '1px solid #ddd',
                    padding: '8px'
                });
                if (styles && styles.td) applyStyles(td, styles.td);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    // Helper function to create a table from an object
    function createTableFromObject(obj) {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        // Default styles
        applyStyles(table, {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '10px 0'
        });

        // Apply custom styles if provided
        if (styles && styles.table) applyStyles(table, styles.table);

        for (const key in obj) {
            const tr = document.createElement('tr');
            const tdKey = document.createElement('td');
            const tdValue = document.createElement('td');

            tdKey.textContent = key;
            if (Array.isArray(obj[key])) {
                tdValue.appendChild(createTableFromArray(obj[key]));
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                tdValue.appendChild(createTableFromObject(obj[key]));
            } else {
                tdValue.textContent = obj[key];
            }

            applyStyles(tdKey, {
                border: '1px solid #ddd',
                padding: '8px',
                backgroundColor: '#0CAFFF',
                color : 'white'
            });
            applyStyles(tdValue, {
                border: '1px solid #ddd',
                padding: '8px'
            });

            if (styles && styles.td) {
                applyStyles(tdKey, styles.td);
                applyStyles(tdValue, styles.td);
            }

            tr.appendChild(tdKey);
            tr.appendChild(tdValue);
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        return table;
    }

    // Determine if the input JSON is an array or an object
    const table = Array.isArray(json) ? createTableFromArray(json) : createTableFromObject(json);
    div.appendChild(table);
}
