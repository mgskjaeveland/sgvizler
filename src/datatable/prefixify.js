
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
        DT.prefixify = datatables.add(modST, 'prefixify', function (data) {
            var c, clen = data.getNumberOfColumns(),
                r, rlen = data.getNumberOfRows();

            for (c = 0; c < clen; c += 1) {
                if (data.getColumnType(c) === 'string') {
                    for (r = 0; r < rlen; r += 1) {
                        data.setValue(r, c,
                            namespace.prefixify(data.getValue(r, c))
                            );
                    }
                }
            }
            return data;
        });

