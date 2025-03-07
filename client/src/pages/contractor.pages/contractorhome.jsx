import Card from "../../components/ui/card";
import CardContent from "../../components/ui/card-content";
const contractorHome = () => {
    return (
      <div className="grid grid-cols-1   mt-5 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Earnings</h3>
            <p className="text-2xl font-bold text-green-600">$5,400</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default contractorHome;