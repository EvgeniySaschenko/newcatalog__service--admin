// Lang
export type LangType = {
  ua: string;
  ru: string;
}

export let LangInit = (): LangType => {
  return {
    ua: '',
    ru: '',
  }
}

// Section
export type SectionType = {
  id: number;
  isHiden: boolean;
  name: LangType;
  priority: number;
};

// Rating
export type RatingSortType = 'alexa' | 'click';

export type RatingTypeType = 'site';

export type RatingDisplayType = 'tile' | 'inline';

export type RatingType = {
  id: number;
  descr: LangType;
  name: LangType;
  sectionsIds: object;
  typeDisplay: RatingDisplayType;
  typeRating: RatingTypeType;
  typeSort: RatingSortType;
};

export type RatingItemType = {
  id: number;
  isCreatedScreen: boolean;
  isHiden: boolean;
  labelsIds: object;
  name: LangType;
  priority: number;
  ratingId: number;
  url: string;
};

// Label
export type LabelType = {
  id: number;
  name: LangType;
  color: string;
  ratingId: number;
};
