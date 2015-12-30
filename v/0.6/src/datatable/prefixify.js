
        /** 
         * Walks through all cells of columns with datatype string and
         * runs prefixify, which replaces namespace with its prefix.
         *
         * @method prefixify
         * @public
         * @param {google.visualization.DataTable} data
         * @return {google.visualization.DataTable}
         * @since 0.6.0
         */
        DT.prefixify = datatables.add(modST, 'prefixify', function (dataTable) {
            var c, clen = dataTable.getNumberOfColumns(),
                r, rlen = dataTable.getNumberOfRows();

            for (c = 0; c < clen; c += 1) {
                if (dataTable.getColumnType(c) === 'string') {
                    for (r = 0; r < rlen; r += 1) {
                        dataTable.setValue(r, c,
                            namespace.prefixify(dataTable.getValue(r, c))
                            );
                    }
                }
            }
            return dataTable;
        });

