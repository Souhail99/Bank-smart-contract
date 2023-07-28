import { categories } from '../models/categories'
export interface TopicLogo {
    topic: categories;
    url: string;
}
const topicLogo_Acceuil: TopicLogo = {
    topic: 'Home',
    url:'',
};
const topicLogo_GitHub: TopicLogo = {
topic: 'GitHub',
 url: 'https://github.com/Souhail99/Bank-smart-contract',
};

export const allTopicLogos: TopicLogo[] = [topicLogo_Acceuil, topicLogo_GitHub];