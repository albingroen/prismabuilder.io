import Button from "../../../components/Button";
import Page from "../../../components/Page";
import Sidebar from "../../../components/Sidebar";
import Stack from "../../../components/Stack";

export default function Schema() {
  return (
    <Page>
      <Sidebar backLink="/" heading="School platform">
        <Stack direction="vertical" className="h-full" justify="between">
          <p></p>

          <Stack direction="vertical" spacing="small">
            <Button>New model...</Button>
          </Stack>
        </Stack>
      </Sidebar>

      <Page.Content>models</Page.Content>
    </Page>
  );
}
