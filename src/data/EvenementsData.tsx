export type Evenement = {
  id: number;
  NomEven: string;
  Artiste: string;
  Lieu: string;
  dateProp: Date;
  googleMapsLink: string;
  photos: string[];
};


export const evenementsData: Evenement[] = [
  {
    id: 1,
    NomEven: "Ginguettes",
    Artiste: "Mitchy",
    Lieu: "St-Etienne  - Puits Couriot",
    dateProp: new Date("2023-07-08T20:00"),
    googleMapsLink: "https://www.google.fr/maps/place/Parc+de+Couriot/@45.4382774,4.3752663,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5afc128667b83:0x9c7293820b498ab5!8m2!3d45.4382737!4d4.3778412!16s%2Fg%2F11h57wgcvz?entry=ttu",
    photos: [
      "/images/Evenements/Concert01/01.jpg",
      "/images/Evenements/Concert01/02.jpg",
      "/images/Evenements/Concert01/03.jpg",
      "/images/Evenements/Concert01/04.jpg",
    ],
  },
  {
    id: 2,
    NomEven: "Concert Paris",
    Artiste: "Mitchy",
    Lieu: "Galerie Openbach 13ème - Paris",
    dateProp: new Date("2023-09-22T20:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/OpenBach/@48.8310371,2.3623494,17z/data=!3m2!4b1!5s0x47e67220a9d43937:0x42293bf4ce392ace!4m6!3m5!1s0x47e67220adca9d13:0x5bbf315298a5cb73!8m2!3d48.8310336!4d2.3649243!16s%2Fg%2F11g7z4yg82?entry=ttu",
    photos: [
      "/images/Evenements/Concert02/01.jpg",
      "/images/Evenements/Concert02/01.png",
      "/images/Evenements/Concert02/02.jpg",
      "/images/Evenements/Concert02/03.jpg",
      "/images/Evenements/Concert02/04.jpg",
      "/images/Evenements/Concert02/05.jpg",
    ],
  },
  {
    id: 3,
    NomEven: "Fête de la musique",
    Artiste: "Mitchy",
    Lieu: "Place Jean-jaures - St-Etienne",
    dateProp: new Date("2023-06-21T18:30:00"),
    googleMapsLink: "https://www.google.fr/maps/place/Pl.+Jean+Jaur%C3%A8s,+42000+Saint-%C3%89tienne/@45.440716,4.3841448,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5ac029da9f7f1:0x414b3bb8dc734cf5!8m2!3d45.440716!4d4.3867197!16s%2Fg%2F11c6rjkd2_?entry=ttu",
    photos: [

      "/images/Evenements/Concert03/01.jpg",
      "/images/Evenements/Concert03/02.jpg",
      "/images/Evenements/Concert03/03.jpg",
      "/images/Evenements/Concert03/04.jpg",
      "/images/Evenements/Concert03/05.jpg",
      "/images/Evenements/Concert03/06.jpg",
      "/images/Evenements/Concert03/07.jpg",
      "/images/Evenements/Concert03/08.jpg",
      "/images/Evenements/Concert03/09.jpg",
      "/images/Evenements/Concert03/10.jpg",
      "/images/Evenements/Concert03/11.jpg",
      "/images/Evenements/Concert03/12.jpg",
      "/images/Evenements/Concert03/13.jpg",
      "/images/Evenements/Concert03/14.jpg",
      "/images/Evenements/Concert03/15.jpg",
    ],
  },

  {
    id: 5,
    NomEven: "Concert Le Fil",
    Artiste: "Mitchy",
    Lieu: "Le fil - St-Etienne",
    dateProp: new Date("2024-03-08T20:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/Le+fil/@45.440716,4.3841448,17z/data=!4m6!3m5!1s0x47f5ac0f66cd2107:0xcbc62a819c78387d!8m2!3d45.4500083!4d4.3905714!16s%2Fg%2F122sg14q?entry=ttu",
    photos: [
      "/images/Evenements/Concert05/01.jpg",
      "/images/Evenements/Concert05/02.jpg",
      "/images/Evenements/Concert05/03.jpg",
      "/images/Evenements/Concert05/04.jpg",
      "/images/Evenements/Concert05/05.jpg",
      "/images/Evenements/Concert05/06.jpg",
      "/images/Evenements/Concert05/07.jpg",

    ],
  },


  {
    id: 6,
    NomEven: "Concert POP",
    Artiste: "Mitchy",
    Lieu: "POP - St-Etienne",
    dateProp: new Date("2024-05-10T20:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/POP/@45.4352154,4.3868099,18.29z/data=!4m10!1m2!2m1!1spop+saint+etienne!3m6!1s0x47f5af565830be1f:0x78290c85cdd71096!8m2!3d45.435094!4d4.387789!15sChFwb3Agc2FpbnQgZXRpZW5uZVoTIhFwb3Agc2FpbnQgZXRpZW5uZZIBA2JhcuABAA!16s%2Fg%2F11l1f77p_d?entry=ttu",
    photos: [
      "/images/Evenements/Concert06/01.jpg",
      "/images/Evenements/Concert06/02.jpg",
      "/images/Evenements/Concert06/03.jpg",
      "/images/Evenements/Concert06/04.jpg",
      "/images/Evenements/Concert06/05.jpg",
      "/images/Evenements/Concert06/06.jpg",
      "/images/Evenements/Concert06/07.jpg",
      "/images/Evenements/Concert06/08.jpg",

    ],
  },

  {
    id: 7,
    NomEven: "Sunsquare festival",
    Artiste: "Mitchy",
    Lieu: "Square Marcel Paul, Rive-de-Gier",
    dateProp: new Date("2024-06-29T20:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/Sq.+Marcel+Paul,+42800+Rive-de-Gier/@45.529753,4.6177251,17z/data=!3m1!4b1!4m6!3m5!1s0x47f4fda0a1e37ecf:0xcf38359ec12c80a2!8m2!3d45.529753!4d4.6203!16s%2Fg%2F1trpkk8z?entry=ttu",
    photos: [
      "/images/Evenements/Concert07/01.jpg",
      "/images/Evenements/Concert07/02.jpg",
      "/images/Evenements/Concert07/03.jpg",
      "/images/Evenements/Concert07/04.jpg",
      "/images/Evenements/Concert07/05.jpg",

    ],
  },


  {
    id: 9,
    NomEven: "Concert avec Meryl, Rainbow Soul et Satchok",
    Artiste: "Mitchy, Rainbow, Soul et Satchok",
    Lieu: "Délirium Café - St-Etienne",
    dateProp: new Date("2024-09-20T20:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/D%C3%A9lirium+Caf%C3%A9+Saint-%C3%89tienne/@45.4408117,4.3826932,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5af004b74d7a3:0xd4c87a5292e54dd6!8m2!3d45.4408117!4d4.3852681!16s%2Fg%2F11svhm4b11?entry=ttu",
    photos: [
      "/images/Evenements/Concert09/POP.jpg",
    ],

  },


  {
    id: 10,
    NomEven: "Fan Zone Place Jean Jaurès J.O. Paralympiques",
    Artiste: "Mitchy",
    Lieu: "Place Jean Jaurès - St-Etienne",
    dateProp: new Date("2024-09-05T22:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/Pl.+Jean+Jaur%C3%A8s,+42000+Saint-%C3%89tienne/@45.4408117,4.3826932,17z/data=!4m6!3m5!1s0x47f5ac029da9f7f1:0x414b3bb8dc734cf5!8m2!3d45.440716!4d4.3867197!16s%2Fg%2F11c6rjkd2_?entry=ttu",
    photos: [
      "/images/Evenements/Concert10/JO2024.jpg",

    ],

  },

  {
    id: 11,
    NomEven: "Concert avec Greboo et ASCH",
    Artiste: "Mitchy, Greboo et ASCH",
    Lieu: "Délirium Café- St-Etienne",
    dateProp: new Date("2024-08-30T19:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/D%C3%A9lirium+Caf%C3%A9+Saint-%C3%89tienne/@45.4408117,4.3826932,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5af004b74d7a3:0xd4c87a5292e54dd6!8m2!3d45.4408117!4d4.3852681!16s%2Fg%2F11svhm4b11?entry=ttu",
    photos: [
      "/images/Evenements/Concert11/batch_DSC00311.jpg",

    ],

  },
  {
    id: 12,
    NomEven: "Hip Hop Talents",
    Artiste: "Mitchy",
    Lieu: "E.Leclerc- Lyon",
    dateProp: new Date("2024-06-01T15:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/D%C3%A9lirium+Caf%C3%A9+Saint-%C3%89tienne/@45.4408117,4.3826932,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5af004b74d7a3:0xd4c87a5292e54dd6!8m2!3d45.4408117!4d4.3852681!16s%2Fg%2F11svhm4b11?entry=ttu",
    photos: [
      "/images/Evenements/Concert12/01.jpg",
      "/images/Evenements/Concert12/02.jpg",
      "/images/Evenements/Concert12/03.jpg",
      "/images/Evenements/Concert12/04.jpg",
      "/images/Evenements/Concert12/05.jpg",
      "/images/Evenements/Concert12/06.jpg",
      "/images/Evenements/Concert12/07.jpg",
    ],

  },

  {
    id: 13,
    NomEven: "Hip Hop Talents",
    Artiste: "Mitchy",
    Lieu: "E.Leclerc- Lyon",
    dateProp: new Date("2023-09-03T15:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/D%C3%A9lirium+Caf%C3%A9+Saint-%C3%89tienne/@45.4408117,4.3826932,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5af004b74d7a3:0xd4c87a5292e54dd6!8m2!3d45.4408117!4d4.3852681!16s%2Fg%2F11svhm4b11?entry=ttu",
    photos: [
      "/images/Evenements/Concert13/01.jpg",
      "/images/Evenements/Concert13/02.jpg",
      "/images/Evenements/Concert13/03.jpg",
      "/images/Evenements/Concert13/04.jpg",
      "/images/Evenements/Concert13/05.jpg",
      "/images/Evenements/Concert13/06.jpg",
      "/images/Evenements/Concert13/07.jpg",

    ],

  },

  {
    id: 99,
    NomEven: "évenement suprise..",
    Artiste: "Mitchy",
    Lieu: "St-Etienne",
    dateProp: new Date("2024-09-27T00:00:00"),
    googleMapsLink: "https://www.google.fr/maps/place/D%C3%A9lirium+Caf%C3%A9+Saint-%C3%89tienne/@45.4408117,4.3826932,17z/data=!3m1!4b1!4m6!3m5!1s0x47f5af004b74d7a3:0xd4c87a5292e54dd6!8m2!3d45.4408117!4d4.3852681!16s%2Fg%2F11svhm4b11?entry=ttu",
    photos: [
      "/images/Evenements/Concert99/P1109970.jpg",

    ],

  },

]
