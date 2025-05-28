const DetailItem = ({ label, value }) => (
  <div>
    <span className="font-medium">{label}: </span>
    <span>{value}</span>
  </div>
);

export default DetailItem;