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
import { fetchNews } from "../api/news";
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
	const classes = useStyles(); 
	const preventDefault = (event) => event.preventDefault();
	const [page, setPage] = useState(1)
	const [endOfData, setEndOfData] = useState(false);
	const [loading, setLoading] = useState(false)

	const loadMore = () => {
		if (!endOfData) {
			setPage(page + 1)
		}
	}

	const getDataCallback = useCallback(() => {
		setLoading(true);
		Promise.resolve(fetchNews(page)).then((response) => {
			setLoading(false);
			if (response.length) {
				setData([...data, ...response])
			} else {
				setEndOfData(true)
			}
		})
	}, [page])

	useEffect(() => {
		getDataCallback()
	}, [getDataCallback])

	return (
		<div className={classes.root}>
			{data.map((value, index) => (
				<div key={index}>
					<div>{value.number}</div>
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
									<Link href={value.href} onClick={preventDefault} variant="h6">
										{value.title}
									</Link>
									</Typography>
									<Typography variant="body2" gutterBottom>
										{value.sitestr}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										
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
		</div>
	)
}
  