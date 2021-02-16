import { Box, Button, Typography, Card, CardHeader, CardContent} from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Item(props: any){
    const { name, id, description, auctionId } = props.props;

    return (
        <Box m={6} key={id}>
            <Card>
                <Box p={6}>
                    <CardHeader title={`${name} (Id: ${id})`} subheader={description}/>
                    <CardContent>
                        {auctionId ? 
                        <Button variant="contained" disabled>
                            Auction Created
                        </Button>
                        : 
                        <Link to={`/create-auction?cardId=${id}`}>
                            <Button variant="contained" color="primary">
                                Create Auction
                            </Button>
                        </Link>
                        }
                    </CardContent>
                </Box>
            </Card>
        </Box>
    )
}