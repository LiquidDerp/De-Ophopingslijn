# De-Ophopingslijn
Gedurende het project hebben we de app ‘De Ophopingslijn’ gemaakt.    ‘De Ophopingslijn’ heeft als doel om de drukte bij tram- en bushaltes na te gaan en deze weer te geven.Om onze app te kunnen verwezenlijken, hebben we gebruik gemaakt van HTML, CSS, Javascript, PHP,  JSON, de iRail-API van De Lijn, SQL en databanken. Met behulp van databanken hebben we onze app efficiënter gemaakt. In onze app maken we vooral gebruik van wifi gebaseerde lokalisatie als lokalisatiemethode en van Lambertcoördinaten als coördinatensysteem. Als je onze app opent, wordt er een kaart weergegeven met daarop markers die alle tram- en bushaltes in de omgeving aanduiden. Als je op een marker drukt, komt er een infowindow tevoorschijn met daarin de naam van de halte en de vertrektijden van de eerst drie bussen of trams die aan die halte vertrekken. In de zijbalk geven we de naam van de drie dichtstbijzijnde haltes weer met onder elke halte een knop ‘routebeschrijving’. Door op deze knop te drukken, wordt er door Google Maps een routebeschrijving naar de desbetreffende halte aangemaakt.  De drukte aan een bepaalde halte wordt weergegeven door de kleur van de marker. Bij meer dan 2,5 personen per vierkante meter spreken we van een grote drukte, deze haltes krijgen een rode marker. Tussen 1,5 en 2,5 personen per vierkante meter spreken we van een gemiddelde drukte, deze haltes krijgen een oranje marker. Bij minder dan 1,5 personen per vierkante meter spreken we over een rustige halte, deze haltes krijgen een groene marker. Als het te druk is aan één van de meest dichtstbijzijnde haltes, dan stellen we een alternatieve halte voor waar het minder druk is. 