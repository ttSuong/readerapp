import React, { useCallback, useEffect, useState } from "react";
import { 
	Paper,
	Grid,
	Typography,
	ButtonBase,
	Button,
	CircularProgress,
	Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchDescription, fetchNews, fetchDetail } from "../api/news";
import DetailNews from './DetailNews';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
		margin: 20
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
		marginBottom: theme.spacing(1)
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
	btnGroup: {
		textAlign: 'center'
	}
}));
export default () => {

	const [data, setData] = useState([]);
	const [descriptions, setDescriptions] = useState([]);
	const classes = useStyles(); 
	const preventDefault = (event) => event.preventDefault();
	const [page, setPage] = useState(1);
	const [endOfData, setEndOfData] = useState(false);
	const [loading, setLoading] = useState(false);
	const [queue, setQueue] = useState([]);
	const [openDetail, setExcuteDetail] = useState(false);
	const [currentDetail, setCurrentDetail] = useState('');

	const loadMore = () => {
		if (!endOfData) {
			setPage(page + 1)
		}
	}
	const handleClickOpen = (href) => {
		Promise.resolve(fetchDetail(href)).then((res) => {
			if(res) {
				setExcuteDetail(true);
				setCurrentDetail(res);
			}
		});
		
  };

  const handleClose = () => {
    setExcuteDetail(false);
  };

	const getDescriptions = async (href) => {
		const response = await fetchDescription(href)
		if (response && response.length) {
			setDescriptions([...descriptions, response[0]])
		}
		setQueue(queue.slice(1))
	}

	const getDataCallback = useCallback(() => {
		setLoading(true);
		Promise.resolve(fetchNews(page)).then((response) => {
			setLoading(false);
			if (response.length) {
				let hrefs = response.map((r) => r.href)
				setQueue([...queue, ...hrefs])
				setData([...data, ...response])
			} else {
				setEndOfData(true)
			}
		})
	}, [page])

	useEffect(() => {
		if (!queue.length) {
			return;
		}

		getDescriptions(queue[0])
	}, [queue])

	useEffect(() => {
		getDataCallback()
	}, [getDataCallback])

	return (
		<div className={classes.root}>
			{data.map((value, index) => (
				<div key={index}>
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<Grid item>
							<ButtonBase className={classes.image}>
								<img className={classes.img} alt="complex" src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ" />
							</ButtonBase>
						</Grid>
						<Grid item xs={12} sm container>
							<Grid item xs container direction="column" spacing={2}>
								<Grid item xs>
									<Typography gutterBottom variant="subtitle1">
									<Link variant="h6" onClick={() => handleClickOpen(value.href)}>
										{value.number}.{value.title}
									</Link>
									</Typography>
									<Typography variant="body2" gutterBottom>
										{value.sitestr}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										{descriptions[index]}
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="body2" style={{ cursor: 'pointer' }}>
										{value.points} points by {value.user} {value.age}
									</Typography>
								</Grid>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">{value.comments}</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
				{!endOfData && <div className={classes.btnGroup}>
					{index === data.length - 1 && 
					<Button size="small" variant='outlined' onClick={loadMore} disabled={loading}>
						View More {' '}
						{loading && <CircularProgress size={17} />}
					</Button>}
				</div>}
			</div>
			))}
			{openDetail &&
				<DetailNews 
					open={openDetail} 
					handleClose={handleClose}
					currentDetail={currentDetail} />
			}
		</div>
	)
}
  