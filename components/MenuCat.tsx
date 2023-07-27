import Link from 'next/link';
import { FC } from 'react';
import styles from '../styles/Home.module.css';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList' 
import MenuItem from '@mui/material/MenuItem'; 
import Typography from '@mui/material/Typography';
import { TopicLogo, allTopicLogos } from '../utils/categorie';

const LearnMenuComponent: FC<{}> = ({}) => {
    let index='';
return (
    <>
    <Paper sx={{ color:"black", width: 320, maxWidth: '100%'}}>
        <MenuList>
            {allTopicLogos.map((topic: TopicLogo, index: number) => (
              <Link 
                key={index}
                href={`/${topic.url.toLowerCase()}`} 
                passHref
              >
                <MenuItem
                  className='menu-item'
                  sx={{
                    height:'50px',
                  }}
                >

                  <Typography variant='body1' color= 'black' className={styles.__className_44d3552}>
                        {topic.topic}
                  </Typography>
                </MenuItem>
              </Link>
            ))}
        </MenuList>
    </Paper>
    <style>{`
        .menu-item:hover {
        background-color: gba(9, 211, 173, 0.08);
        }
    `}</style>
    </>
  );
};
export default LearnMenuComponent;
