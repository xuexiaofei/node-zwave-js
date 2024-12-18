import {
	CommandClass,
	ManufacturerSpecificCCGet,
	ManufacturerSpecificCCReport,
	ManufacturerSpecificCommand,
} from "@zwave-js/cc";
import { CommandClasses } from "@zwave-js/core";
import { Bytes } from "@zwave-js/shared/safe";
import test from "ava";

function buildCCBuffer(payload: Uint8Array): Uint8Array {
	return Bytes.concat([
		Uint8Array.from([
			CommandClasses["Manufacturer Specific"], // CC
		]),
		payload,
	]);
}

test("the Get command should serialize correctly", (t) => {
	const cc = new ManufacturerSpecificCCGet({ nodeId: 1 });
	const expected = buildCCBuffer(
		Uint8Array.from([
			ManufacturerSpecificCommand.Get, // CC Command
		]),
	);
	t.deepEqual(cc.serialize({} as any), expected);
});

test("the Report command (v1) should be deserialized correctly", (t) => {
	const ccData = buildCCBuffer(
		Uint8Array.from([
			ManufacturerSpecificCommand.Report, // CC Command
			0x01,
			0x02,
			0x03,
			0x04,
			0x05,
			0x06,
		]),
	);
	const cc = CommandClass.parse(
		ccData,
		{ sourceNodeId: 2 } as any,
	) as ManufacturerSpecificCCReport;
	t.is(cc.constructor, ManufacturerSpecificCCReport);

	t.is(cc.manufacturerId, 0x0102);
	t.is(cc.productType, 0x0304);
	t.is(cc.productId, 0x0506);
});
