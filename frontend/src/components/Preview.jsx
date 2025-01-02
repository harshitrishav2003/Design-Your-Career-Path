const Preview = ({ data }) => (
    <div>
      <h2>Resume Preview</h2>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Phone:</strong> {data.phone}</p>
      <p><strong>Education:</strong> {data.education}</p>
      <p><strong>Experience:</strong> {data.experience}</p>
      <p><strong>Skills:</strong> {data.skills}</p>
    </div>
  );
  
  export default Preview;
  