// Types related to Movie list and details

/**
 * Single movie type in a movie list
 */
export interface IMovieInList {
    adult: boolean;
    backdrop_path: null | string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
  
  /**
   * Movie List type
   */
  export interface IMovieList {
    page: number;
    results: IMovieInList[];
    total_pages: number;
    total_results: number;
  }
  
  /**
   * Genre list type
   */
  export interface IGenre {
    id: number;
    name: string;
  }
  
  /**
   * Company production type
   */
  interface IProductionCompany {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }
  
  /**
   * Country Type
   */
  interface IProductionCountry {
    iso_3166_1: string;
    name: string;
  }
  
  /**
   * Language Type
   */
  interface ISpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }
  
  /**
   * Single Movie details
   */
  export interface ISingleMovieDetails {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null;
    budget: number;
    genres: IGenre[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: IProductionCompany[];
    production_countries: IProductionCountry[];
    release_date: Date;
    revenue: number;
    runtime: number;
    spoken_languages: ISpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
  
  /**
   * Cast type of cast in the list
   */
  export interface ICast {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: null | string;
    cast_id?: number;
    character?: string;
    credit_id: string;
    order?: number;
    department?: string;
    job?: string;
  }
  
  /**
   * Cast list type
   */
  export interface ICastList {
    id: number;
    cast: ICast[];
    crew: ICast[];
  }
  
  /**
   * Single person details
   */
  export interface IPersonDetails {
    adult: false;
    also_known_as: string[];
    biography: string;
    birthday: string;
    deathday: string | null;
    gender: 0 | 1 | 2 | 3;
    homepage: string | null;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
  }
  
  /**
   * Movie list of a person
   */
  export interface ICastMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    credit_id: string;
    department: string;
    job: string;
  }
  
  export interface ICrewMovie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character: string;
    credit_id: string;
    order: number;
  }
  
  export interface IMovieListOfPerson {
    id: string;
    crew: ICastMovie[];
    cast: ICrewMovie[];
  }
  
  /**
   * Video related to a movie available videos
   */
  export interface IVideoDetails {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: Date;
    id: string;
  }
  
  export interface IVideoDetailsResult {
    results: IVideoDetails[];
    id: number;
  }
  