import React, { Fragment, useCallback, useEffect, useState } from "react";
import { 
	Paper,
	Grid,
	Typography,
	ButtonBase,
	Button,
	CircularProgress,
	Avatar,
	Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fetchDescription, fetchNews, fetchDetail } from "../api/news";
import DetailNews from "./DetailNews";
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

	const handleOpenDetail = (href) => {
		Promise.resolve(fetchDetail(href)).then((response) => {
			if (response) {
				setCurrentDetail(response);
				setExcuteDetail(true);
			} 
		})
	}

	const handleClose = () => {
		setExcuteDetail(false);
	}
	
	const getDescriptions = async (href) => {
		const response = await fetchDescription(href);
		if (response != null) {
			setDescriptions([...descriptions, response]);
		}
		setQueue(queue.slice(1));
	}

	const getDataCallback = useCallback(() => {
		setLoading(true);
		Promise.resolve(fetchNews(page)).then((response) => {
			setLoading(false);
			if (response.length) {
				let hrefs = response.map((r) => r.href)
				setQueue([...queue, ...hrefs]);
				setData([...data, ...response]);
			} else {
				setEndOfData(true);
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
								<img className={classes.img} 
								onError={(e)=>{e.target.onerror = null; e.target.src="https://picsum.photos/seed/picsum/200/300"}}
								src={descriptions[index] ? descriptions[index].src : ''} />
							</ButtonBase>
						</Grid>
						<Grid item xs={12} sm container>
							<Grid item xs container direction="column" spacing={2}>
								<Grid item xs>
									<Typography gutterBottom variant="subtitle1">
									<Link component="button" onClick={() => handleOpenDetail(value.href)} target="_blank" variant="h6">
										{value.number}.{value.title}
									</Link>
									</Typography>
									<Typography variant="body2" gutterBottom>
										{value.sitestr}
									</Typography>
									{descriptions[index] != null ?
									<Typography variant="body2" color="textSecondary">
										{descriptions[index].desc}
									</Typography> :
									<CircularProgress />
									}
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
					<Button size="small" variant='outlined' color="primary" onClick={loadMore} disabled={loading}>
						View More {' '}  <ExpandMoreIcon />
						{loading && <CircularProgress size={17} />}
					</Button>}
				</div>}
			</div>
			))}
			{openDetail &&
					<DetailNews 
					open={openDetail} 
					content={currentDetail}
					handleClose={handleClose}
					/>
				}
		</div>
	)
}
  