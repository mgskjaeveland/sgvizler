    // DATES
    test("S.parser.getGoogleJsonValue: Dates", function() {
             function mytest(value) {
                 return S.parser.getGoogleJsonValue(value, "date", "literal");
             }

             deepEqual(mytest("2000-01-01"), new Date(2000,0,1));
             deepEqual(mytest("2000-01-30"), new Date(2000,0,30));
             deepEqual(mytest("2000-01-31"), new Date(2000,0,31));

             deepEqual(mytest("2000-12-01"), new Date(2000,11,1));
             deepEqual(mytest("2000-12-30"), new Date(2000,11,30));
             deepEqual(mytest("2000-12-31"), new Date(2000,11,31));

             deepEqual(mytest("2000-01-01"), new Date(2000,0,1));
             deepEqual(mytest("2000-02-01"), new Date(2000,1,1));
             deepEqual(mytest("2000-03-01"), new Date(2000,2,1));
             deepEqual(mytest("2000-04-01"), new Date(2000,3,1));
             deepEqual(mytest("2000-05-01"), new Date(2000,4,1));
             deepEqual(mytest("2000-06-01"), new Date(2000,5,1));
             deepEqual(mytest("2000-07-01"), new Date(2000,6,1));
             deepEqual(mytest("2000-08-01"), new Date(2000,7,1));
             deepEqual(mytest("2000-09-01"), new Date(2000,8,1));
             deepEqual(mytest("2000-10-01"), new Date(2000,9,1));
             deepEqual(mytest("2000-11-01"), new Date(2000,10,1));
             deepEqual(mytest("2000-12-01"), new Date(2000,11,1));
             deepEqual(mytest("2000-13-01"), new Date(2000,12,1));
         });

    // DATETIMES
    test("S.parser.getGoogleJsonValue: Datetimes", function() {
             function mytest(value) {
                 return S.parser.getGoogleJsonValue(value, "datetime", "literal");
             }

             deepEqual(mytest("2000-01-01Z00:00:00"), new Date(2000,0,1,0,0,0));
             deepEqual(mytest("2000-01-30Z00:00:00"), new Date(2000,0,30,0,0,0));
             deepEqual(mytest("2000-01-31Z00:00:00"), new Date(2000,0,31,0,0,0));

             deepEqual(mytest("2000-12-01Z00:00:00"), new Date(2000,11,1,0,0,0));
             deepEqual(mytest("2000-12-30Z00:00:00"), new Date(2000,11,30,0,0,0));
             deepEqual(mytest("2000-12-31Z00:00:00"), new Date(2000,11,31,0,0,0));

             // some random numbers
             deepEqual(mytest("2000-01-01Z01:24:01"), new Date(2000,0,1,1,24,1));
             deepEqual(mytest("2000-02-01Z02:23:02"), new Date(2000,1,1,2,23,2));
             deepEqual(mytest("2000-03-01Z03:22:03"), new Date(2000,2,1,3,22,3));
             deepEqual(mytest("2000-04-01Z04:21:04"), new Date(2000,3,1,4,21,4));
             deepEqual(mytest("2000-05-01Z05:20:05"), new Date(2000,4,1,5,20,5));
             deepEqual(mytest("2000-06-01Z06:19:06"), new Date(2000,5,1,6,19,6));
             deepEqual(mytest("2000-07-01Z07:18:07"), new Date(2000,6,1,7,18,7));
             deepEqual(mytest("2000-08-01Z08:17:08"), new Date(2000,7,1,8,17,8));
             deepEqual(mytest("2000-09-01Z09:16:09"), new Date(2000,8,1,9,16,9));
             deepEqual(mytest("2000-10-01Z10:15:01"), new Date(2000,9,1,10,15,1));
             deepEqual(mytest("2000-11-01Z11:14:02"), new Date(2000,10,1,11,14,2));
             deepEqual(mytest("2000-12-01Z12:13:03"), new Date(2000,11,1,12,13,3));
             deepEqual(mytest("2000-13-01Z13:12:04"), new Date(2000,12,1,13,12,4));
             deepEqual(mytest("2000-10-01Z14:11:05"), new Date(2000,9,1,14,11,5));
             deepEqual(mytest("2000-11-01Z15:10:06"), new Date(2000,10,1,15,10,6));
             deepEqual(mytest("2000-12-01Z16:09:07"), new Date(2000,11,1,16,9,7));
             deepEqual(mytest("2000-13-01Z17:08:08"), new Date(2000,12,1,17,8,8));
             deepEqual(mytest("2000-10-01Z18:07:09"), new Date(2000,9,1,18,7,9));
             deepEqual(mytest("2000-11-01Z19:06:01"), new Date(2000,10,1,19,6,1));
             deepEqual(mytest("2000-12-01Z20:05:02"), new Date(2000,11,1,20,5,2));
             deepEqual(mytest("2000-13-01Z21:04:03"), new Date(2000,12,1,21,4,3));
             deepEqual(mytest("2000-10-01Z22:03:04"), new Date(2000,9,1,22,3,4));
             deepEqual(mytest("2000-11-01Z23:02:05"), new Date(2000,10,1,23,2,5));
             deepEqual(mytest("2000-12-01Z24:01:06"), new Date(2000,11,1,24,1,6));
         });
