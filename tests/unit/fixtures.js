import { toEpisode } from '../../src/lib/episodes.js'

const base = { wem_locked: false, series: null, featured: false, created_at: '2022-05-01T12:00:00Z' }
const thumb = id => `https://i.vimeocdn.com/video/${id}-abc-d_1280?region=us`

export const rawEpisodes = [
  { ...base, id: 11, key: 'ninas-chimney-swifts', title: "Nina's Chimney Swifts", description: null,
    video_link: 'https://player.vimeo.com/video/766193890?h=bbf13fc37c', animal_class: 'Bird',
    tags: ['birds', 'chimney-swifts', 'lees-mcrae'], play_count: 52, released_at: '2022-11-02T00:00:00Z',
    thumbnail_url: thumb(11), duration: 350 },
  { ...base, id: 8, key: 'jimmy-the-beaver-goes-free', title: 'Jimmy the Beaver Goes Free',
    description: 'Byron is back with Jimmy the Beaver! Learn more about beavers and their habitats in this WEM, and watch Byron release Jimmy back into the wild.',
    video_link: 'https://player.vimeo.com/video/693738907?h=aaffeb9532', animal_class: 'Mammal, Small',
    tags: ['beaver', 'byron', 'release'], play_count: 15, released_at: '2022-09-19T00:00:00Z',
    thumbnail_url: thumb(8), duration: 195 },
  { ...base, id: 6, key: 'byrons-hawk-in-the-crepe-myrtle-tree', title: "Byron's Hawk in the Crepe Myrtle Tree", description: null,
    video_link: 'https://player.vimeo.com/video/703316078?h=07b3163870', animal_class: 'Raptor',
    tags: ['bird', 'byron', 'hawk', 'red-tailed-hawk', 'rescue'], play_count: 11, released_at: '2022-08-22T00:00:00Z',
    thumbnail_url: thumb(6), duration: 157 },
  { ...base, id: 1, key: 'lady-eagle-dock-lake-auman', title: 'Lady Eagle Dock - Lake Auman', description: null,
    video_link: 'https://player.vimeo.com/video/693713363?h=6cff38f7a4', animal_class: 'Raptor',
    tags: ['bald-eagle', 'lake', 'release', 'rescue'], play_count: 62, released_at: '2022-05-20T00:00:00Z',
    thumbnail_url: thumb(1), duration: 156, featured: true },
]

export const catalog = rawEpisodes.map(toEpisode)
