        /**
         * This function is a modified version of
         * http://jsfiddle.net/asgallant/HkjDe/ A discussion is here
         * https://groups.google.com/forum/?fromgroups=#!topic/google-visualization-api/jl_5JpODmw8
         *
         * pivot gets in input a Google DataTable. Table must have 3
         * columns.  Pivoting the table will swap all the rows of the
         * first colum as columns for the new table and all the rows
         * of the second column as the rows of the new table. The
         * aggregate function is the sum.  So, borrowing data form the
         * discussion above:
         *
         *     Equipment   Location  Count 
         *     e1          c1        6
         *     e2          c1        2
         *     e3          c1        1
         *     e4          c1        3
         *     e1          c2        7
         *     e2          c2        3
         *     e1          c3        8
         *     e2          c3        4
         *
         *         E1  E2  E3  E4
         *     C1  XX  xx  xx  xx
         *     C2  xx  xx   0  xx
         *     C3   0  xx  xx  xx
         *
         * @method pivot
         * @public
         * @param {google.visualization.DataTable} data
         * @return {google.visualization.DataTable}
         * @since 0.6.0
         */
        DT.pivot = datatables.add(modST, "pivot", function (dataTable) {

            var columns = dataTable.getDistinctValues(0), // Get elements which will become columns.
                dataView = new google.visualization.DataView(dataTable),

            // Manually pivot the data table. First, we have to separate
            // out the "equipment" values into their own columns using a
            // DataView with calculated columns.

                cary = columns.map(function (item) {
                    return {
                        type: 'number',
                        label: item,
                        calc: function (dt, row) {
                            // return values only for the rows where first element === item
                            return (dt.getValue(row, 0) === item) ? dt.getValue(row, 2) : null;
                        }
                    };
                }),

            // Next, we group the view on the location column, which gets
            // us the pivoted data.
                rary = columns.map(function (item, index) {
                    return {
                        column: index + 1,
                        type: 'number',
                        label: item,
                        aggregation: google.visualization.data.sum
                    };
                });

            // Put 1 in front of everything.
            cary.unshift(1);

            dataView.setColumns(cary);

            return google.visualization.data.group(dataView, [0], rary);
        });

